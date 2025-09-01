# Getting Started with Maersk PIPE

Welcome to the Maersk DevOps team! This guide will help you set up your development environment and understand our workflow.

## Prerequisites

- **Access**: GitHub access, AWS credentials, and VPN configuration
- **Tools**: Docker, Terraform, kubectl, and our internal CLI tool
- **Knowledge**: Basic understanding of containerization and cloud infrastructure

## Quick Setup

```bash
# Clone the infrastructure repository
git clone git@github.com:Maersk/infrastructure.git

# Run setup script
cd infrastructure
./scripts/setup-dev-env.sh

# Verify installation
Maersk-cli doctor
```

## Development Workflow

1. **Branch Strategy**: Feature branches from `develop`
2. **Code Review**: Required for all changes  
3. **Testing**: Automated tests must pass
4. **Deployment**: Through CI/CD pipeline only

## Useful Commands

```bash
# Deploy to staging
Maersk-cli deploy staging

# Check cluster status  
kubectl get pods -n Maersk-core

# Access logs
Maersk-cli logs service=tracking-api
```

## Support Resources

- **Microsoft Teams**: `DevOps Support` channel - General questions
- **PagerDuty**: Production incidents and urgent issues  
- **Documentation**: Continuous improvements and updates

---

*Need help? Contact your onboarding buddy or join our daily stand-up at 9:30 AM EST*