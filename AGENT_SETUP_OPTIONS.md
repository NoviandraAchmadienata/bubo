# Cara Menggunakan Agent Automation Prompt

## 🤖 Opsi 1: Gunakan dengan Copilot Agent (CLI)

### Command:
```bash
copilot agent run \
  --prompt "$(cat AGENT_AUTOMATION_PROMPT.md | head -100)" \
  --workspace "c:\Users\Lenovo\Documents\GitHub\bubo" \
  --output "SETUP_REPORT.md"
```

---

## 🔄 Opsi 2: GitHub Actions Workflow

**File: `.github/workflows/mqtt-setup.yml`**

```yaml
name: MQTT ESP32 Setup Automation

on:
  workflow_dispatch:  # Manual trigger

jobs:
  setup:
    runs-on: windows-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Read Setup Prompt
        run: |
          cat AGENT_AUTOMATION_PROMPT.md >> $GITHUB_STEP_SUMMARY
      
      - name: Install Dependencies
        run: pip install -r requirements.txt
      
      - name: Setup Environment
        run: |
          Copy-Item .env.example .env
          Write-Host "✓ Environment file created"
      
      - name: Run Tests
        run: python test_mqtt_integration.py
      
      - name: Generate Report
        run: |
          echo "Setup completed at: $(Get-Date)" > IMPLEMENTATION_STATUS.md
          type IMPLEMENTATION_STATUS.md >> $GITHUB_STEP_SUMMARY
      
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: setup-report
          path: IMPLEMENTATION_STATUS.md
```

**Jalankan dengan:**
```bash
gh workflow run mqtt-setup.yml
```

---

## 🐳 Opsi 3: Docker Container Automation

**File: `Dockerfile.setup`**

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copy project
COPY . /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    mosquitto \
    mosquitto-clients \
    postgresql-client \
    git

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy automation prompt
COPY AGENT_AUTOMATION_PROMPT.md /setup_guide.md

# Run setup
RUN python test_mqtt_integration.py

# Start services
CMD ["sh", "-c", "mosquitto -c /etc/mosquitto/mosquitto.conf & python app.py"]
```

**Jalankan dengan:**
```bash
docker build -f Dockerfile.setup -t bubo-mqtt-setup .
docker run -it -p 1883:1883 -p 5000:5000 bubo-mqtt-setup
```

---

## 📋 Opsi 4: Terraform/Infrastructure as Code

**File: `terraform/mqtt_setup.tf`**

```hcl
# Run MQTT ESP32 setup as Terraform provisioner

locals {
  setup_script = file("${path.module}/../AGENT_AUTOMATION_PROMPT.md")
  workspace_path = "c:\\Users\\Lenovo\\Documents\\GitHub\\bubo"
}

resource "null_resource" "mqtt_setup" {
  provisioner "local-exec" {
    command = "cd ${local.workspace_path} && python test_mqtt_integration.py"
  }

  provisioner "local-exec" {
    command = "powershell -File setup.ps1"
  }

  triggers = {
    setup_file = filemd5("${path.module}/../AGENT_AUTOMATION_PROMPT.md")
  }
}

resource "docker_container" "mosquitto" {
  name  = "mosquitto-broker"
  image = docker_image.mosquitto.id
  
  ports {
    internal = 1883
    external = 1883
  }
}
```

---

## 🔧 Opsi 5: Jenkins Pipeline

**File: `Jenkinsfile.mqtt-setup`**

```groovy
pipeline {
    agent any
    
    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Setup Environment') {
            steps {
                echo '📋 Reading setup prompt...'
                sh 'cat AGENT_AUTOMATION_PROMPT.md'
                
                echo '📦 Installing dependencies...'
                sh 'pip install -r requirements.txt'
            }
        }
        
        stage('Configure MQTT') {
            steps {
                echo '🔧 Setting up MQTT broker...'
                sh 'docker run -d -p 1883:1883 eclipse-mosquitto'
                sh 'sleep 3'
            }
        }
        
        stage('Test Connectivity') {
            steps {
                echo '🧪 Running test suite...'
                sh 'python test_mqtt_integration.py'
            }
        }
        
        stage('Generate Report') {
            steps {
                sh 'echo "Setup completed at $(date)" > SETUP_REPORT.md'
                archiveArtifacts artifacts: 'SETUP_REPORT.md'
            }
        }
    }
    
    post {
        always {
            echo '✅ MQTT setup pipeline complete'
        }
        failure {
            echo '❌ Setup failed - check logs'
        }
    }
}
```

**Jalankan dengan:**
```bash
jenkins run Jenkinsfile.mqtt-setup
```

---

## 🎯 Opsi 6: GitLab CI/CD

**File: `.gitlab-ci.yml`**

```yaml
mqtt_setup:
  stage: setup
  image: python:3.9
  
  before_script:
    - apt-get update
    - apt-get install -y mosquitto mosquitto-clients postgresql-client
    - pip install -r requirements.txt
  
  script:
    - echo "Starting MQTT ESP32 Setup..."
    - python test_mqtt_integration.py
    - cp .env.example .env
    - echo "Setup completed" > SETUP_REPORT.md
  
  artifacts:
    paths:
      - SETUP_REPORT.md
    expire_in: 1 week
  
  only:
    - web  # Manual trigger
```

---

## 🤖 Opsi 7: Azure DevOps Pipeline

**File: `azure-pipelines.yml`**

```yaml
trigger: none  # Manual trigger

pool:
  vmImage: 'windows-latest'

steps:
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '3.9'
  
  - script: |
      pip install -r requirements.txt
    displayName: 'Install Dependencies'
  
  - script: |
      python test_mqtt_integration.py
    displayName: 'Run MQTT Tests'
  
  - script: |
      powershell -File setup.ps1
    displayName: 'Setup MQTT Broker'
  
  - task: PublishBuildArtifacts@1
    inputs:
      pathToPublish: '$(Build.ArtifactStagingDirectory)'
      artifactName: 'mqtt-setup-report'
```

---

## 🎬 Opsi 8: Bash Script Langsung

**File: `run_mqtt_setup.sh`**

```bash
#!/bin/bash

# MQTT ESP32 Setup Script
# Usage: bash run_mqtt_setup.sh

set -e  # Exit on error

WORKSPACE="${1:-.}"
LOG_FILE="$WORKSPACE/SETUP.log"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "===== MQTT ESP32 Setup Started ====="
log "Workspace: $WORKSPACE"

# Phase 1: Environment
log "Phase 1: Environment Setup"
cd "$WORKSPACE"
pip install -r requirements.txt >> "$LOG_FILE" 2>&1 || { log "❌ Pip install failed"; exit 1; }
cp .env.example .env
log "✓ Environment ready"

# Phase 2: MQTT Broker
log "Phase 2: Mosquitto Setup"
if command -v mosquitto &> /dev/null; then
    mosquitto -d -c mosquitto.conf
    log "✓ Mosquitto running"
else
    log "⚠ Mosquitto not found - using Docker"
    docker run -d -p 1883:1883 eclipse-mosquitto
fi
sleep 2

# Phase 3: Testing
log "Phase 3: Running Tests"
python test_mqtt_integration.py >> "$LOG_FILE" 2>&1 || { log "❌ Tests failed"; exit 1; }

# Phase 4: Report
log "Phase 4: Generating Report"
cat > IMPLEMENTATION_STATUS.md << EOF
# MQTT ESP32 Setup Report
- Setup Date: $(date)
- Status: ✅ SUCCESS
- Workspace: $WORKSPACE
- Log: $LOG_FILE
EOF

log "===== Setup Completed Successfully ====="
cat IMPLEMENTATION_STATUS.md
```

**Jalankan dengan:**
```bash
bash run_mqtt_setup.sh /path/to/bubo
```

---

## 📱 Opsi 9: Android Automation (Tasker)

```
Tasker Profile: MQTT Setup
Trigger: Manual

Task: Run Setup
├─ Shell Command: 
│  adb shell python /data/data/mqtt/test_mqtt_integration.py
├─ Wait: 5 seconds
├─ If (Output contains "PASS")
│  ├─ Notify: "✓ MQTT Setup Successful"
│  └─ Record: setup_time
└─ Else
   └─ Notify: "❌ MQTT Setup Failed"
```

---

## 🎓 Quick Reference: Memilih Opsi

| Opsi | Kegunaan | Kesulitan |
|------|----------|----------|
| Copilot CLI | Development, testing | Rendah |
| GitHub Actions | CI/CD automation | Rendah |
| Docker | Container deployment | Sedang |
| Jenkins | Enterprise CI/CD | Sedang |
| Terraform | Infrastructure | Tinggi |
| GitLab CI | GitLab ecosystem | Sedang |
| Azure DevOps | Microsoft ecosystem | Sedang |
| Bash Script | Simple automation | Rendah |

---

## 🚀 Recommended Implementation Path

### Untuk Development:
```bash
# Gunakan Bash Script atau Copilot CLI
bash run_mqtt_setup.sh
```

### Untuk CI/CD (GitHub):
```bash
# Gunakan GitHub Actions
gh workflow run mqtt-setup.yml
```

### Untuk Production:
```bash
# Gunakan Docker + Terraform
terraform apply
docker-compose up
```

---

## 📝 Custom Agent Prompt Template

Jika ingin membuat custom prompt untuk agent Anda:

```
You are an automation agent for MQTT ESP32 integration setup.

RESOURCES PROVIDED:
- AGENT_AUTOMATION_PROMPT.md (main instructions)
- app_mqtt.py (MQTT client)
- test_mqtt_integration.py (test suite)
- esp32_mqtt_client.ino (firmware)

OBJECTIVE:
Execute the 6-phase setup process documented in AGENT_AUTOMATION_PROMPT.md

CONSTRAINTS:
- Do not modify existing files unless specified
- All changes must be reversible
- Generate detailed report of every step
- Log all errors with solutions

DELIVERABLES:
- ✓ Setup status (pass/fail)
- ✓ System configuration report
- ✓ Test results (5 tests)
- ✓ Implementation status file
- ✓ Any issues and resolutions

EXECUTE NOW:
1. Read AGENT_AUTOMATION_PROMPT.md
2. Execute each phase
3. Verify each checkpoint
4. Generate final report
5. Report completion status
```

---

**SUMMARY:** Pilih opsi yang sesuai dengan infrastructure Anda dan jalankan setup MQTT ESP32 secara automated dengan confidence!
