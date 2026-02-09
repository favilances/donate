package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Donation struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FromUserID primitive.ObjectID `bson:"fromUserId,omitempty" json:"fromUserId,omitempty"`
	ToUserID   primitive.ObjectID `bson:"toUserId" json:"toUserId"`
	Amount     float64            `bson:"amount" json:"amount"`
	Date       time.Time          `bson:"date" json:"date"`
	SessionID  string             `bson:"sessionId" json:"-"`
}
