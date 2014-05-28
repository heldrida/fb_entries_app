protected_branch='master'

# get branch name
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [[ $current_branch = $protected_branch ]]; then
    
  # backup db and uploads files to development
  DEVELOPMENT_WP_URL="emergespace\.magnolia\.thelatenightsalon\.co\.uk\/wordpress";
  PRODUCTION_WP_URL="tlnscompetitions\.co\.uk\/emerge_space\/wordpress";
  DB_LOCAL_NAME="emerge_space";
  DB_PRODUCTION_NAME="tlnscomp_emergespace";
  NOW=$(date +"%Y%m%d%H%M");
  DB_FILENAME="production-emerge_space-$NOW.sql";
  PATH_DEV="/var/www/emerge_space"; 
  PATH_PRODUCTION="/home/tlnscomp/www/emerge_space";

  # dump production db to temp
  ssh root@tlnscompetitions.co.uk "mysqldump $DB_PRODUCTION_NAME > $PATH_PRODUCTION/tmp/$DB_FILENAME && exit";

  # save to development environment
  rsync -va root@tlnscompetitions.co.uk:$PATH_PRODUCTION/tmp/production-emerge_space-$NOW.sql $PATH_DEV/tmp --progress;
  
  # make a cp as latest
  cp $PATH_DEV/tmp/$DB_FILENAME $PATH_DEV/tmp/latest.sql;

  # find and replace production url with development url
  sed -i "s/$PRODUCTION_WP_URL/$DEVELOPMENT_WP_URL/g" $PATH_DEV/tmp/latest.sql;
  
  # update development database with latest copy
  mysql -uroot -proot -e "drop database if exists $DB_LOCAL_NAME; create database if not exists $DB_LOCAL_NAME;" && mysql -uroot -proot $DB_LOCAL_NAME < $PATH_DEV/tmp/latest.sql;
  
  # save binary files to development environment
  rsync -va root@tlnscompetitions.co.uk:$PATH_PRODUCTION/wordpress/wp-content/plugins/space_competition/uploads/ $PATH_DEV/wordpress/wp-content/plugins/space_competition/uploads/ --progress;
  
  # change ownership
  chown www-data:www-data $PATH_DEV/wordpress/wp-content/plugins/space_competition/uploads/;

    RESULT=$? #this gets the exit status of last cmd
    
    # if not equal
    if [ $RESULT -ne 0 ]; then 
        echo "Something failed while trying to backup the production database and get the uploaded files!"
        exit 1
    fi

fi
exit 0
