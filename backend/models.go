// models.go
package main

import (
    "gorm.io/gorm"
    "github.com/google/uuid"
)

type User struct {
    UserID    uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
    FirstName string    `gorm:"not null"`
    LastName  string    `gorm:"not null"`
    Email     string    `gorm:"unique;not null"`
    Password  string    `gorm:"not null"`
}