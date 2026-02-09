package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name         string             `bson:"name" json:"name"`
	Email        string             `bson:"email" json:"email"`
	Username     string             `bson:"username" json:"username"`
	PasswordHash string             `bson:"passwordHash" json:"-"`
	Bio          string             `bson:"bio" json:"bio"`
	ProfilePic   string             `bson:"profilePic" json:"profilePic"`
	Wallet       float64            `bson:"wallet" json:"wallet"`
	CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
}

type SanitizedUser struct {
	ID         primitive.ObjectID `json:"id"`
	Name       string             `json:"name"`
	Email      string             `json:"email"`
	Username   string             `json:"username"`
	Bio        string             `json:"bio"`
	ProfilePic string             `json:"profilePic"`
	Wallet     float64            `json:"wallet"`
	CreatedAt  time.Time          `json:"createdAt"`
}

type PublicUser struct {
	ID         primitive.ObjectID `json:"id"`
	Name       string             `json:"name"`
	Username   string             `json:"username"`
	Bio        string             `json:"bio"`
	ProfilePic string             `json:"profilePic"`
	CreatedAt  time.Time          `json:"createdAt"`
}

func (u *User) Sanitize() SanitizedUser {
	return SanitizedUser{
		ID:         u.ID,
		Name:       u.Name,
		Email:      u.Email,
		Username:   u.Username,
		Bio:        u.Bio,
		ProfilePic: u.ProfilePic,
		Wallet:     u.Wallet,
		CreatedAt:  u.CreatedAt,
	}
}

func (u *User) PublicProfile() PublicUser {
	return PublicUser{
		ID:         u.ID,
		Name:       u.Name,
		Username:   u.Username,
		Bio:        u.Bio,
		ProfilePic: u.ProfilePic,
		CreatedAt:  u.CreatedAt,
	}
}
