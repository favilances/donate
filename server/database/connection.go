package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var db *mongo.Database

func Connect(ctx context.Context, uri string, dbName string) error {
	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	if err := mongoClient.Ping(ctx, nil); err != nil {
		return err
	}

	client = mongoClient
	db = client.Database(dbName)

	if err := ensureIndexes(ctx); err != nil {
		return err
	}

	return nil
}

func ensureIndexes(ctx context.Context) error {
	users := db.Collection("users")

	_, err := users.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "email", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    bson.D{{Key: "username", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	})
	return err
}

func Database() *mongo.Database {
	return db
}

func Collection(name string) *mongo.Collection {
	return db.Collection(name)
}

func Disconnect(ctx context.Context) error {
	if client != nil {
		return client.Disconnect(ctx)
	}
	return nil
}
