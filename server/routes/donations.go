package routes

import (
	"context"
	"math"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"donation-app/server/database"
	"donation-app/server/middleware"
	"donation-app/server/models"
	"donation-app/server/utils"
)

type createDonationRequest struct {
	Amount     float64 `json:"amount"`
	ToUsername string  `json:"toUsername"`
}

type walletDonation struct {
	ID           string    `json:"id"`
	Amount       float64   `json:"amount"`
	Date         time.Time `json:"date"`
	FromUserName string    `json:"fromUserName,omitempty"`
}

func RegisterDonationRoutes(router fiber.Router) {
	protected := router.Group("", middleware.Protected())
	protected.Get("/wallet", walletHandler)
	protected.Post("/donations", createDonationHandler)
	protected.Get("/donations/selected", selectedDonationsHandler)
}

func selectedDonationsHandler(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(models.User)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "Oturum geçerli değil")
	}

	idParam := strings.TrimSpace(c.Query("ids"))
	if idParam == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Seçili bağış bulunamadı")
	}

	idParts := strings.Split(idParam, ",")
	objectIDs := make([]primitive.ObjectID, 0, len(idParts))
	for _, part := range idParts {
		trimmed := strings.TrimSpace(part)
		if trimmed == "" {
			continue
		}
		objectID, err := primitive.ObjectIDFromHex(trimmed)
		if err != nil {
			return utils.Error(c, fiber.StatusBadRequest, "Geçersiz bağış kimliği")
		}
		objectIDs = append(objectIDs, objectID)
	}

	if len(objectIDs) == 0 {
		return utils.Error(c, fiber.StatusBadRequest, "Geçersiz seçim")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := database.Collection("donations").Aggregate(ctx, bson.A{
		bson.M{"$match": bson.M{"_id": bson.M{"$in": objectIDs}, "toUserId": user.ID}},
		bson.M{"$lookup": bson.M{
			"from":         "users",
			"localField":   "fromUserId",
			"foreignField": "_id",
			"as":           "fromUser",
		}},
		bson.M{"$unwind": bson.M{"path": "$fromUser", "preserveNullAndEmptyArrays": true}},
		bson.M{"$project": bson.M{
			"amount":       1,
			"date":         1,
			"fromUserName": "$fromUser.name",
			"_id":          1,
		}},
		bson.M{"$sort": bson.M{"date": -1}},
	})
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Bağışlar yüklenemedi")
	}
	defer cursor.Close(ctx)

	results := make([]walletDonation, 0, len(objectIDs))
	for cursor.Next(ctx) {
		var doc struct {
			ID           primitive.ObjectID `bson:"_id"`
			Amount       float64            `bson:"amount"`
			Date         time.Time          `bson:"date"`
			FromUserName string             `bson:"fromUserName"`
		}
		if err := cursor.Decode(&doc); err != nil {
			continue
		}
		results = append(results, walletDonation{
			ID:           doc.ID.Hex(),
			Amount:       doc.Amount,
			Date:         doc.Date,
			FromUserName: doc.FromUserName,
		})
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{"donations": results})
}

func createDonationHandler(c *fiber.Ctx) error {
	var req createDonationRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Geçersiz istek")
	}

	amount := math.Round(req.Amount*100) / 100
	if amount <= 0 {
		return utils.Error(c, fiber.StatusBadRequest, "Geçersiz tutar")
	}

	target := strings.TrimSpace(strings.ToLower(req.ToUsername))
	if target == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Hedef kullanıcı gerekli")
	}

	donor, ok := c.Locals("user").(models.User)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "Oturum geçerli değil")
	}

	if donor.Username == target {
		return utils.Error(c, fiber.StatusBadRequest, "Kendine bağış yapamazsın")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var recipient models.User
	if err := database.Collection("users").FindOne(ctx, bson.M{"username": target}).Decode(&recipient); err != nil {
		return utils.Error(c, fiber.StatusNotFound, "Hedef kullanıcı bulunamadı")
	}

	donation := models.Donation{
		ID:         primitive.NewObjectID(),
		FromUserID: donor.ID,
		ToUserID:   recipient.ID,
		Amount:     amount,
		Date:       time.Now().UTC(),
	}

	if _, err := database.Collection("donations").InsertOne(ctx, donation); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Bağış kaydedilemedi")
	}

	if _, err := database.Collection("users").UpdateByID(ctx, recipient.ID, bson.M{"$inc": bson.M{"wallet": amount}}); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Cüzdan güncellenemedi")
	}

	recipient.Wallet += amount
	donorName := strings.TrimSpace(donor.Name)
	if donorName == "" {
		donorName = donor.Username
	}

	return utils.Success(c, fiber.StatusCreated, fiber.Map{
		"donation": fiber.Map{
			"id":           donation.ID.Hex(),
			"amount":       donation.Amount,
			"date":         donation.Date,
			"fromUserName": donorName,
		},
		"recipient": fiber.Map{
			"username": recipient.Username,
			"name":     recipient.Name,
			"wallet":   recipient.Wallet,
		},
	})
}

func walletHandler(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(models.User)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "Oturum geçerli değil")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var freshUser models.User
	if err := database.Collection("users").FindOne(ctx, bson.M{"_id": user.ID}).Decode(&freshUser); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Cüzdan yüklenemedi")
	}

	cursor, err := database.Collection("donations").Aggregate(ctx, bson.A{
		bson.M{"$match": bson.M{"toUserId": user.ID}},
		bson.M{"$sort": bson.M{"date": -1}},
		bson.M{"$limit": 20},
		bson.M{"$lookup": bson.M{
			"from":         "users",
			"localField":   "fromUserId",
			"foreignField": "_id",
			"as":           "fromUser",
		}},
		bson.M{"$unwind": bson.M{"path": "$fromUser", "preserveNullAndEmptyArrays": true}},
		bson.M{"$project": bson.M{
			"amount":       1,
			"date":         1,
			"fromUserName": "$fromUser.name",
		}},
	})
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Cüzdan yüklenemedi")
	}
	defer cursor.Close(ctx)

	donations := make([]walletDonation, 0)
	for cursor.Next(ctx) {
		var doc struct {
			ID           primitive.ObjectID `bson:"_id"`
			Amount       float64            `bson:"amount"`
			Date         time.Time          `bson:"date"`
			FromUserName string             `bson:"fromUserName"`
		}
		if err := cursor.Decode(&doc); err != nil {
			continue
		}
		donations = append(donations, walletDonation{
			ID:           doc.ID.Hex(),
			Amount:       doc.Amount,
			Date:         doc.Date,
			FromUserName: doc.FromUserName,
		})
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{
		"wallet":    freshUser.Wallet,
		"donations": donations,
	})
}
