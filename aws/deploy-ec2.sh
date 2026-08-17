#!/bin/bash
# ==============================================================================
# FoodieSpot AWS EC2 Automated Deployment Script
# Target OS: Amazon Linux 2023 / Ubuntu 22.04 LTS
# ==============================================================================

set -e

echo "🚀 Starting FoodieSpot Application Deployment on AWS EC2..."

# 1. Update system packages
echo "📦 Updating system packages..."
if command -v yum &> /dev/null; then
    sudo yum update -y
    sudo yum install -y docker git
elif command -v apt-get &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y docker.io git docker-compose
fi

# 2. Enable and start Docker service
echo "🐳 Configuring Docker daemon..."
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# 3. Mount AWS EBS volume for persistent database logs and uploads backup
EBS_DEV="/dev/xvdf"
MOUNT_DIR="/mnt/ebs-data"

if [ -b "$EBS_DEV" ]; then
    echo "💾 AWS EBS Volume detected at $EBS_DEV. Formatting and mounting..."
    if ! blkid "$EBS_DEV"; then
        sudo mkfs -t ext4 "$EBS_DEV"
    fi
    sudo mkdir -p "$MOUNT_DIR"
    sudo mount "$EBS_DEV" "$MOUNT_DIR"
    echo "✅ EBS Volume successfully mounted at $MOUNT_DIR"
fi

# 4. Clone or pull latest code repository
PROJECT_DIR="/home/$USER/FoodieSpot-AWS-FullStack"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "📥 Repository not found. Make sure to transfer or git clone the repo into $PROJECT_DIR"
fi

# 5. Launch containers using Docker Compose
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    echo "⚙️  Building and launching FoodieSpot containers..."
    docker-compose up --build -d
    echo "✅ FoodieSpot application deployed successfully on AWS EC2!"
    echo "🌐 Access Health Check: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):4000/api/aws/status"
fi
