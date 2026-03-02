package routes

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"

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
		update["bio"] = *req.Bio
	}
	if req.ProfilePic != nil {
		update["profilePic"] = *req.ProfilePic
	}

	if len(update) == 0 {
		return utils.Error(c, fiber.StatusBadRequest, "Güncellenecek alan bulunamadı")
	}

	if _, err := database.Collection("users").UpdateByID(ctx, user.ID, bson.M{"$set": update}); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Profil güncellenemedi")
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{"message": "Profil güncellendi"})
}
