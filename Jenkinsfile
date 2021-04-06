pipeline {
  agent any
  stages {
    stage('Set up') {
      steps {
        git(url: 'https://github.com/fonteyne/odoo_addons_bom.git', branch: '13.0', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        git(url: 'https://github.com/fonteyne/odoo_webshop.git', branch: 'master', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        git(url: 'https://github.com/fonteyne/enterprise.git', branch: '13.0', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        git(url: 'https://github.com/fonteyne/odoo_addons_second_cashier.git', branch: '13.0', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        git(url: 'https://github.com/fonteyne/odoo_addons_shopmaster.git', branch: '13.0', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
      }
    }

  }
}