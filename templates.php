<script type="text/ng-template" id="enter-your-face.html">
<div class="row row-a row-header row-header-entries">
    <img src="img/enter_your_face.png?20140307" />

    <div class="astronauts">
        <div class="lady animated bounce" style="animation-duration: 4s; animation-iteration-count: infinite; animation-timing-function: linear;">
            <img src="img/spacewoman.png">
        </div>
    </div>
</div>
<div class="row row-enter-your-face">
    <p>upload a photo of yourself and tell us why you should go on the <br> mission of a lifetime ofr the chance to get your face into space.</p>
        <div class="myForm">
            <div class="col col-a">
                <div class="photo">
                    <img ng-src="https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-frc3/t1/31013_3540463685355_1622922072_n.jpg?lvh=1" src="https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-frc3/t1/31013_3540463685355_1622922072_n.jpg?lvh=1">
                </div>

                <br>

                <button>use profile photo</button>

                <br>

                <button>browse</button>

                <br>

                <input type="text" />
            </div>
            <div class="col col-b">
                <p>name</p>
                <input type="text" name="full_name" />

                <p>email</p>
                <input type="text" name="email" />

                <p>Phone No</p>
                <input type="text" name="telephone" />

                <p>why you?</p>
                <textarea name="description"></textarea>

            </div>
            <div class="row">                
                <p><input type="checkbox" name="agreement"> I agree to the T's and C's and that I am over 16 years old, and if I am under 18 years old I have the permission of my parent or guardian to enter this competition.</p>
            </div>
        </div>

</div>
<ng-include src="'footer.html'"></ng-include>
</script>
<script type="text/ng-template" id="terms-and-conditions.html">
<div class="row row-a row-header row-header-entries">
    <img src="img/ts_and_cs.png?20140307" />
</div>
<div class="row row-terms-and-conditions">
    <div class="terms-and-conditions">
"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur"
    </div>
</div>
<ng-include src="'footer.html'"></ng-include>
</script>
<script type="text/ng-template" id="entries.html">
<div class="row row-a row-header row-header-entries">
    <img src="img/space_cowboys.png?20140307" />

    <div class="astronauts">
        <div class="lady animated bounce" style="animation-duration: 4s; animation-iteration-count: infinite; animation-timing-function: linear;">
            <img src="img/spacewoman.png">
        </div>
    </div>
</div>
<div class="row row-entries">
    <div class="entry" ng-repeat="entry in entries">
        <div class="photo">
            <img ng-src="{{ entry.photo }}" />
        </div>
        <div class="details">
            <p class="red">Name</p>
            <p class="full_name">{{ entry.full_name }}</p>
            <p class="red">Why should you be the one?</p>            
            <p class="description">{{ entry.description }}</p>
        </div>
    </div>
    <button class="space">load more faces!</button>
    <div class="animatable-elements">
        <div class="cat-foo">
            <img src="img/cat-foo.png" />
        </div>
        <div class="balloons">
            <div class="first animated vanish" style="animation-duration: 6s; animation-iteration-count: infinite; animation-timing-function: linear;">
                <img src="img/Ballon_float1.png">
            </div>
            <div class="second animated vanish" style="animation-duration: 6.9s; animation-iteration-count: infinite; animation-timing-function: linear;">
                <img src="img/Ballon_float2.png">
            </div>
        </div>
    </div>
</div>
<ng-include src="'footer.html'"></ng-include>
</script>
<script type="text/ng-template" id="home.html">
<div class="row row-a row-header">
    <img src="img/header_getyourfaceintospace.png?20140306" />
</div>

<div class="row row-b row-enter-now planet-enter-blue font-gothic">
    <div class="astronauts">
        <div class="lady">
            <img src="img/spacewoman.png" />
        </div>
        <div class="can-cat">
            <img src="img/spacecatred.png" />
        </div>
    </div>
    <div class="balloons">
        <div class="first">
            <img src="img/Ballon_float1.png" />
        </div>
        <div class="second">
            <img src="img/Ballon_float2.png" />
        </div>
    </div>
    <div class="text-shadow-dark">
        <img src="img/Enter_now.png?20140306" />
        <p>time to pack those bags and put your socks on space kids.<br/>cause' we're taking you on a <span class="highlight">journey through time &amp; space</span>. <br/> well...pretty much.</p>
        <p>we are giving <span class="highlight">one lucky winner</span> the chance to get their beautiful face up <span class="highlight">into the stratosphere</span>.<br/>so what are you waiting for?<br/>sign up for the <span class="highlight">emerge space programme now!</span></p>
        <p>all you have to do is upload your finest selfie and tell us why you should be the one...</p>
    </div>
</div>

<div class="row row-b row-countdown font-gothic">

    <table id="contdown">
        <thead class="text-shadow-soft">
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
        <tbody class="text-shadow-dark">
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

    <p class="text-shadow-soft">until launch!</p>

    <div class="contest-description text-shadow-dark">

        <p><?php echo "the competition runs from start date 01/05/2014 to 31/05/2014 at that point we'll go through all of the entries and the one that we feel has given us the best reason to go will be picked as our intergalactic hero."; ?></p>

    </div>

</div>

<div class="row row-b row-video font-gothic">
    
    <p class="text-shadow-soft">check out this "space cowboy"</p>
    
    <iframe width="586" height="356" src="//www.youtube.com/embed/Y-rFT-uHm4w?rel=0" frameborder="0" allowfullscreen></iframe>

</div>

<div class="row row-b row-blastoff font-gothic">
    
    <div class="description">

        <p>a winner will be selected and with the use of some advanced cloning technological, top of the range scene and math, their face will be transformed into an intergalactic phenomenon, aka (a wibbly wobbly spaceman model.)</p>

        <p>it will then be launched up into the stratosphere to gaze down on this little planet we call home.</p>
        
        <p>we'll be filming this spectacular eet in glorious technicolor so your mission can be played over and over again.</p>

        
        <div class="spacecat">
            <img src="img/spacecat.png?20140306" />
        </div>

    </div>

</div>

<div class="row row-b row-enter-now font-gothic">

    <div class="planet">
        <img src="img/planet_blue.png" />
    </div>
    
    <button class="space">enter now!</button>

</div>

<ng-include src="'footer.html'"></ng-include>
</script>
<script type="text/ng-template" id="footer.html">
<div class="row row-b row-footer font-gothic text-shadow-soft">
    
    <div class="footer-logo"></div>

    <p class="text-shadow-superglow"><a href="http://www.emergespaceprogramme.com" target="_blank">www.emergespaceprogramme.com</a> <a href="https://twitter.com/search?q=%23YourFaceInSpace&src=hash" target="blank"><span class="hashtag">#</span>yourfaceinspace</p>

    <div class="description text-shadow-blue">

        <p>t's and c's apply. please read full terms at our facebook address. the winners face represented on a 3d model will be sent on a weather balloon to the edge of space. competition runs until 16:00 gmt 31/05/2014. you must be over 16 years to enter. <br/> no purchase necessary. you must be a uk resident.</p>

        <p>copyright © <?php echo date('Y', time()); ?> cott beverages ltd. all rights reserved.</p>

    </div>

</div>
</script>
