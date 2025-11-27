-- Create Database
CREATE DATABASE ai_image_generator;
USE ai_image_generator;

-- Table 1: Users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Images
CREATE TABLE images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table 3: Categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Table 4: Image_Categories (Many-to-Many relationship)
CREATE TABLE image_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_id INT,
    category_id INT,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Table 5: Favorites
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    image_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

-- Table 6: Generation_History
CREATE TABLE generation_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    prompt TEXT NOT NULL,
    status ENUM('success', 'failed') DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Nature', 'Natural landscapes and scenery'),
('Animals', 'Wildlife and pets'),
('Space', 'Cosmic and astronomical imagery'),
('Fantasy', 'Magical and fictional scenes'),
('Technology', 'Futuristic and tech themes'),
('Art', 'Artistic and abstract designs');

-- Insert sample user
INSERT INTO users (username, email) VALUES ('demo_user', 'demo@example.com');