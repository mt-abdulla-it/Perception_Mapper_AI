#!/bin/bash
# Health check script for microservices
curl -s -f http://localhost:3000/api/health || exit 1
echo "All services healthy"
