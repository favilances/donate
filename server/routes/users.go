package routes

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"

	"donation-app/server/database"
	"donation-app/server/middleware"
	"donation-app/server/models"
	"donation-app/server/utils"
)

type updateProfileRequest struct {
	Bio        *string `json:"bio"`
	ProfilePic *string `json:"profilePic"`
}

func RegisterUserRoutes(router fiber.Router) {
	router.Get("/search", searchUsers)
	router.Get("/:username", getProfile)

	protected := router.Group("", middleware.Protected())
	protected.Put("/update", updateProfile)
}

func getProfile(c *fiber.Ctx) error {
	username := strings.ToLower(c.Params("username"))
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	if err := database.Collection("users").FindOne(ctx, bson.M{"username": username}).Decode(&user); err != nil {
		return utils.Error(c, fiber.StatusNotFound, "Kullanıcı bulunamadı")
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{"user": user.PublicProfile()})
}

func updateProfile(c *fiber.Ctx) error {
	var req updateProfileRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Geçersiz istek")
	}

	user, ok := c.Locals("user").(models.User)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "Oturum geçerli değil")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{}
	if req.Bio != nil {
		if len(*req.Bio) > 600 {
			return utils.Error(c, fiber.StatusBadRequest, "Biyografi en fazla 600 karakter olabilir")
		}
		update["bio"] = *req.Bio
	}
	if req.ProfilePic != nil {
		pic := *req.ProfilePic
		if pic != "" && !strings.HasPrefix(pic, "http://") && !strings.HasPrefix(pic, "https://") && !strings.HasPrefix(pic, "data:image/") {
			return utils.Error(c, fiber.StatusBadRequest, "Geçersiz profil görseli URL'si")
		}
		if len(pic) > 5*1024*1024 {
			return utils.Error(c, fiber.StatusBadRequest, "Profil görseli çok büyük")
		}
		update["profilePic"] = pic
	}

	if len(update) == 0 {
		return utils.Error(c, fiber.StatusBadRequest, "Güncellenecek alan bulunamadı")
	}

	if _, err := database.Collection("users").UpdateByID(ctx, user.ID, bson.M{"$set": update}); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Profil güncellenemedi")
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{"message": "Profil güncellendi"})
}

func searchUsers(c *fiber.Ctx) error {
	query := strings.TrimSpace(c.Query("q"))
	if query == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Arama sorgusu gerekli")
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 20
	}
	skip := int64((page - 1) * limit)
	limit64 := int64(limit)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{
		"$or": bson.A{
			bson.M{"name": bson.M{"$regex": query, "$options": "i"}},
			bson.M{"username": bson.M{"$regex": query, "$options": "i"}},
		},
	}

	total, err := database.Collection("users").CountDocuments(ctx, filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Arama yapılamadı")
	}

	cursor, err := database.Collection("users").Find(ctx, filter, &options.FindOptions{
		Skip:  &skip,
		Limit: &limit64,
		Sort:  bson.M{"createdAt": -1},
	})
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Arama yapılamadı")
	}
	defer cursor.Close(ctx)

	users := make([]models.PublicUser, 0)
	for cursor.Next(ctx) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			continue
		}
		users = append(users, user.PublicProfile())
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{
		"users": users,
		"total": total,
		"page":  page,
	})
}
