<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, minimum-scale=
1.0, maximum-scale=1">

        <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.3.0/pure-min.css">
        <link rel="stylesheet" href="css/normalize.min.css">
        <link rel="stylesheet" href="css/main.css">
        <link href='http://fonts.googleapis.com/css?family=Carrois+Gothic+SC' rel='stylesheet' type='text/css'>

        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- s: emerge space app -->
        <div id="emerge_space" class="pure-g-r" ng-app="emerge_space">
            
            <div class="pure-u-1">
            
                <nav ng-controller="navigationCtrl">
                    <ul>
                        <li class="txt-a opt" ng-class="isActive('/home')">
                            <a href="#/home">home</a>
                        </li>
                        <li class="txt-a opt opt-enter" ng-class="isActive('/enter-your-face')">
                            <a href="#/enter-your-face">enter</a>
                        </li>
                        <li class="txt-a nav-logo">
                            <img src="img/logo.png?20140306">
                        </li>
                        <li class="txt-a opt" ng-class="isActive('/entries')">
                            <a href="#/entries">entries</a>
                        </li>
                        <li class="txt-a opt" ng-class="isActive('/terms-and-conditions')">
                            <a href="#/terms-and-conditions">t's&amp;c's</a>
                        </li>
                    </ul>
                </nav>

                <div class="spinner" ng-show="isViewLoading"></div>

                <main role="main" ng-show="!isViewLoading" class="my-page-anim">
                    <ui-view></ui-view>
                </main>

            </div>

            <!-- s: templates -->
            <?php include_once("templates.php"); ?>
            <!-- e: templates -->

        </div>
        <!-- e: emerge space app -->

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.1.min.js"><\/script>')</script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular.min.js"></script>
        <script type="text/javascript" src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery.form/3.46/jquery.form.min.js"></script>
        <script src="js/mysettings.js"></script>
        <script src="js/jqform.js"></script>
        <script src="bower_components/angular-easyfb/angular-easyfb.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular-animate.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js"></script>
        <!-- s: hammer js -->
        <script src="js/vendor/hammer.min.js"></script>
        <script src="js/vendor/hammer.fakemultitouch.js"></script>
        <script src="js/vendor/hammer.showtouches.js"></script>
        <!-- e: hammer js -->
        <link href="bower_components/animo.js/animate+animo.css" rel="stylesheet" type="text/css">
        <script src="bower_components/animo.js/animo.js" type="text/javascript"></script>
        <script src="js/main.js"></script>

        <script type="text/javascript">
        // set the date we're counting down to
        var target_date = new Date("May 31, 2014").getTime();
         
        // variables for time units
        var days, hours, minutes, seconds;
         

        // update the tag with id "countdown" every 1 second
        setInterval(function () {
         
            // find the amount of "seconds" between now and target
            var current_date = new Date().getTime();
            var seconds_left = (target_date - current_date) / 1000;
         
            // do some time calculations
            days = parseInt(seconds_left / 86400);
            seconds_left = seconds_left % 86400;
             
            hours = parseInt(seconds_left / 3600);
            seconds_left = seconds_left % 3600;
             
            minutes = parseInt(seconds_left / 60);
            seconds = parseInt(seconds_left % 60);
             
            function getPrefix(x){
                
                if (x < 10) {
                    x = "0" + x;
                };

                return x;
            };

            $('#contdown span.days').text( getPrefix(days) );
            $('#contdown span.hours').text( getPrefix(hours) );
            $('#contdown span.minutes').text( getPrefix(minutes) );
            $('#contdown span.seconds').text( getPrefix(seconds) );

        }, 1000);
        </script>

        <script>
            var _gaq=[['_setAccount','UA-10353005-1'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src='//www.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
    </body>
</html>