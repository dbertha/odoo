pipeline {
  agent {
    node {
      label 'mandatory-label'
      customWorkspace '/data/jenkins/odoo_pipeline'
    }
  }
  stages {
    stage('Set up') {
      steps {
        dir(path: 'odoo_addons_bom') {
          git(url: 'https://github.com/fonteyne/odoo_addons_bom.git', branch: '13.0', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        }

        dir(path: 'odoo_webshop') {
          git(url: 'https://github.com/fonteyne/odoo_webshop.git', branch: 'master', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        }

        dir(path: 'enterprise') {
          git(url: 'https://github.com/fonteyne/enterprise.git', branch: '13.0', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        }

        dir(path: 'odoo_addons_second_cashier') {
          git(url: 'https://github.com/fonteyne/odoo_addons_second_cashier.git', branch: '13.0', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        }

        dir(path: 'odoo_addons_shopmaster') {
          git(url: 'https://github.com/fonteyne/odoo_addons_shopmaster.git', branch: '13.0', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        }

        dir(path: 'odoo') {
          git(url: 'https://github.com/dbertha/odoo.git', branch: '13.0', credentialsId: 'b4450363-44ee-4dea-b6a4-cdb8165a5daf')
        }

        sh 'createdb $BUILD_NUMBER'
        script { 
          module_list = sh(returnStdout: true, script: '''MODULE_LIST=`psql -h pg11-xlarge.cedyenranbub.eu-west-3.rds.amazonaws.com -U reporting fonteynev13prod -t -c "select name from ir_module_module where state = 'installed';"`;
MODULE_LIST=`echo $MODULE_LIST | sed 's/ /,/g'`;
echo "$MODULE_LIST";
  ''').trim()
        }
        echo "$module_list"
      }
    }

    stage('Test') {
      steps {
        sh './odoo/odoo-bin --test-enable --stop-after-init -d $BUILD_NUMBER -u $module_list'
      }
    }

  }
}
