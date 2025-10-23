package database

import (
	"context"
	"time"

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
	return nil
}

func Database() *mongo.Database {
	return db
}

func Collection(name string) *mongo.Collection {
	return db.Collection(name)
}
