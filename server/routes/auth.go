package routes

import (
	"context"
	"regexp"
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

type registerRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type authResponse struct {
	Token string               `json:"token"`
	User  models.SanitizedUser `json:"user"`
}

func RegisterAuthRoutes(router fiber.Router) {
	router.Post("/register", registerHandler)
	router.Post("/login", loginHandler)

	authProtected := router.Group("", middleware.Protected())
	authProtected.Get("/me", meHandler)
}

func registerHandler(c *fiber.Ctx) error {
	var req registerRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Geçersiz istek")
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.Username = strings.TrimSpace(strings.ToLower(req.Username))

	if req.Name == "" || req.Email == "" || req.Username == "" || len(req.Password) < 6 {
		return utils.Error(c, fiber.StatusBadRequest, "Lütfen tüm alanları doğru doldurun")
	}
	if len(req.Username) < 3 || len(req.Username) > 30 {
		return utils.Error(c, fiber.StatusBadRequest, "Kullanıcı adı 3-30 karakter arası olmalı")
	}
	if !regexp.MustCompile(`^[a-z0-9_]+$`).MatchString(req.Username) {
		return utils.Error(c, fiber.StatusBadRequest, "Kullanıcı adı yalnızca harf, rakam ve alt çizgi içerebilir")
	}
	if len(req.Name) > 100 {
		return utils.Error(c, fiber.StatusBadRequest, "İsim en fazla 100 karakter olabilir")
	}
	if len(req.Password) > 72 {
		return utils.Error(c, fiber.StatusBadRequest, "Şifre en fazla 72 karakter olabilir")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	users := database.Collection("users")

	if err := users.FindOne(ctx, bson.M{"email": req.Email}).Err(); err == nil {
		return utils.Error(c, fiber.StatusConflict, "E-posta zaten kayıtlı")
	}

	if err := users.FindOne(ctx, bson.M{"username": req.Username}).Err(); err == nil {
		return utils.Error(c, fiber.StatusConflict, "Kullanıcı adı alınmış")
	}

	hash, err := utils.HashPassword(req.Password)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Şifre oluşturulamadı")
	}

	user := models.User{
		ID:           primitive.NewObjectID(),
		Name:         strings.TrimSpace(req.Name),
		Email:        req.Email,
		Username:     req.Username,
		PasswordHash: hash,
		Wallet:       0,
		CreatedAt:    time.Now(),
	}

	if _, err := users.InsertOne(ctx, user); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Kullanıcı oluşturulamadı")
	}

	token, err := utils.GenerateToken(user.ID.Hex())
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Token oluşturulamadı")
	}

	return utils.Success(c, fiber.StatusCreated, authResponse{
		Token: token,
		User:  user.Sanitize(),
	})
}

func loginHandler(c *fiber.Ctx) error {
	var req loginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Geçersiz istek")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	if err := database.Collection("users").FindOne(ctx, bson.M{"email": strings.ToLower(req.Email)}).Decode(&user); err != nil {
		return utils.Error(c, fiber.StatusUnauthorized, "E-posta veya şifre hatalı")
	}

	if err := utils.CheckPassword(user.PasswordHash, req.Password); err != nil {
		return utils.Error(c, fiber.StatusUnauthorized, "E-posta veya şifre hatalı")
	}

	token, err := utils.GenerateToken(user.ID.Hex())
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Token oluşturulamadı")
	}

	return utils.Success(c, fiber.StatusOK, authResponse{
		Token: token,
		User:  user.Sanitize(),
	})
}

func meHandler(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(models.User)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "Oturum geçerli değil")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var freshUser models.User
	if err := database.Collection("users").FindOne(ctx, bson.M{"_id": user.ID}).Decode(&freshUser); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Kullanıcı bilgileri alınamadı")
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{"user": freshUser.Sanitize()})
}
