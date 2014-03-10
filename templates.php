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

                <button class="red_spc_bg">use profile photo</button>

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
                <p class="text_agreement"><input type="checkbox" name="agreement"> I agree to the T's and C's and that I am over 16 years of age and a resident in the UK. </p>
            </div>
            <button class="space your_face">submit your face!</button>
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
OPERATOR: (1) This competition is operated by Cott Beverages Limited (Cott) of Citrus Grove, Sideley, Kegworth, Derby, DE74 2FJ. Any correspondence concerning the operation of this competition should be sent to that addressed marked for the attention of Emerge Marketing. ENTRY REQUIREMENTS: (2) Entry into this competition is open to UK residents aged over 16 excluding employees (or family members of employees) of Cott or its associated companies and agents. (3) Entry into this competition is subject to these terms and conditions. If you fail to comply with any of the requirements of these terms and conditions then Cott may at its discretion disqualify your entry. (4) The competition is free to enter and there is no requirement to purchase any product in order to enter. (5) Entries into this competition can only be submitted via the facebook page operated on Cott’s behalf at facebook.com/emergestimulationdrink and, entrants must arrange at their own expense for internet access in order to be able to enter. (6) Entries into this competition can be made until 17:00 GMT on 31 May 2014. PRIZE: (7) There is one prize for the winner of this competition which consists of a figure being created in their likeness, this figure will then travel up towards space suspended under a weather balloon. (8) Any other expenses incurred by the winner of this prize draw are excluded and will be the sole responsibility of the winner. (9) This is a two stage competition, for the first stage you must upload your photo to our Facebook app and describe why you deserve the prize, for the second stage our panel of judges will look at all of the entries and decide who deserves the prize based on their entry description. (10) Cott reserves the right to amend or substitute the prize on offer with an alternative of equal or greater value although, there is no cash alternative available. (11) The name and general geographic location of the winner of this competition will be available on request by writing to Cott at the address set out at the start of these terms and conditions after the closing date for this competition. USE OF PERSONAL INFORMATION: (12) The winner of this competition shall participate in any reasonable amount of post promotion publicity as Cott may reasonably request. (13) Cott may use personal information collected about individuals as a result of entering into this competition in accordance with its privacy policy which is available by visiting the www.emergeenergy.com website. GENERAL: (14) The decisions of Cott concerning the operation of this competition will be final and binding. (15) Apart from death or personal injury caused by the negligence acts or omissions of Cott, Cott will not be liable for any loss or damage suffered by entrants in connection with this prize draw nor for any loss or damage which the winner of this prize draw may suffer as a result of enjoying their prize. In particular, Cott shall not be liable for any delay or inability to fulfil the prize due to circumstances outside of the reasonable control of Cott. (15) Force Majeure, Cott cannot be held responsible for anything that is out of its control on delivering the prize, which can include any weather issues that could affect the flight of the balloon and the recovery of the video footage. 
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
