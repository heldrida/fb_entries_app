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
        <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, minimumscale=
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
            
                <nav>
                    <ul>
                        <li class="txt-a opt">
                            home
                        </li>
                        <li class="txt-a opt">
                            enter
                        </li>
                        <li class="txt-a nav-logo">
                            <img src="img/logo.png">
                        </li>
                        <li class="txt-a opt">
                            entries
                        </li>
                        <li class="txt-a opt">
                            t's&amp;c's
                        </li>
                    </ul>
                </nav>

                <main role="main">
                    
                    <div class="row row-a">
                        <img src="img/header_getyourfaceintospace.png" />
                    </div>

                    <div class="row row-b row-enter-now planet-enter-blue font-gothic">
                        <div>
                            <img src="img/Enter_now.png" />
                            <p>time to pack those bags and put your socks on space kids.<br/>cause' we're taking you on a <span class="highlight">journey through time &amp; space</span>. <br/> well...pretty much.</p>
                            <p>we are giving <span class="highlight">one lucky winner</span> the chance to get their beautiful face up <span class="highlight">into the stratosphere</span>.<br/>so what are you waiting for?<br/>sign up for the <span class="highlight">emerge space programme now!</span></p>
                            <p>all you have to do is upload your finest selfie and tell us why you should be the one...</p>
                        </div>
                    </div>

                    <div class="row row-b row-countdown font-gothic">
                        <table id="contdown">
                            <thead>
                                <tr>
                                    <td>days</td>
                                    <td></td>
                                    <td>hours</td>
                                    <td></td>
                                    <td>minutes</td>
                                    <td></td>
                                    <td>seconds</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span class="days">00</span>
                                    </td>
                                    <td>:</td>
                                    <td>
                                        <span class="hours">00</span>
                                    </td>
                                    <td>:</td>
                                    <td>
                                        <span class="minutes">00</span>
                                    </td>
                                    <td>:</td>
                                    <td>
                                        <span class="seconds">00</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p>until launch!</p>
                    </div>

                </main>

            </div>

        </div>
        <!-- e: emerge space app -->


        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.1.min.js"><\/script>')</script>
        <script type="text/javascript">
        // set the date we're counting down to
        var target_date = new Date("May 15, 2014").getTime();
         
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

    </body>
</html>