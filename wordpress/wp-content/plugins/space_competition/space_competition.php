<?php
/**
 *** @package Space Competition
 *** @version 0.1
 ***/
/*
 ** Plugin Name: Space Competition
 ** Description: Facebook competition entries manager
 ***/

add_action( 'admin_menu', 'register_my_custom_menu_page' );

function register_my_custom_menu_page(){
	
	$page_title = "Space Competition";
	$menu_title = "Space Competition";
	$capability = "edit_posts";
	$menu_slug = "space_competition";
	$function = "my_plugin_page";
	$icon_url = plugins_url( 'space_competition/icon.png');
	$position = 6;

	add_menu_page( 
		$page_title, 
		$menu_title, 
		$capability, 
		$menu_slug, 
		$function, 
		$icon_url, 
		$position 
	);

}

function my_wrapper($html){

    $wrapper = '<div ng-app="SpaceCompetitionManager">
    				<input type="text" id="my_base_url" value="'.get_site_url().'" style="display: none">
    				<div id="space_competition" ng-controller="listCtrl">#content#</div>
    			</div>';

    $html = str_replace('#content#', $html, $wrapper);

	return $html;

}

function my_plugin_page(){

    //must check that the user has the required capability 
    if (!current_user_can('edit_posts'))
    {
      wp_die( __('You do not have sufficient permissions to access this page.') );
    }

    $title = "<h2>Space Competition Manager</h2>";

    $options = "<div id=\"space-comp-params\">
    	<label></label>
    </div>";

    $tbl = '
    	<table ng-table="tableParams" class="table" export-csv="csv">
	    	<tbody>
	    		<tr ng-repeat="entry in $data" class="entry_{{$index}}">
					<td data-title="\'Facebook Profile ID\'"><a href="http://facebook.com/{{entry.fb_profile_uid}}" target="_blank">{{entry.fb_profile_uid}}</a></td>
					<td data-title="\'Name\'" sortable="\'full_name\'">{{entry.full_name}}</td>
					<td data-title="\'birthday (Y-M-D)\'">{{entry.birthday}} <span class="age">(Age is {{age(entry.birthday)}})</span></td>
					<td data-title="\'email\'">
						<a href="mailto:{{entry.email}}">{{entry.email}}</a>
					</td>
					<td data-title="\'telephone\'">{{entry.telephone}}</td>
					<td data-title="\'description\'">{{entry.description}}</td>
					<td data-title="\'photo\'">
						<div class="photo">
							<a href="'.get_site_url().'/wp-content/plugins/space_competition/uploads/{{entry.photo}}" target="_blank">
								<img ng-src="'.get_site_url().'/wp-content/plugins/space_competition/uploads/{{entry.photo}}" />
							</a>
						</div>
						<p style="display:none;">'.get_site_url().'/wp-content/plugins/space_competition/uploads/{{entry.photo}}</p>
					</td>
					<td data-title="\'approved\'" sortable="\'approved\'">
						<div class="fooBar" ng-class="setApprovalClass(entry.approved)" ng-click="approve($index, entry.id, entry.approved)">{{entry.approved}}</div>
					</td>
					<td data-title="\'registration\'" sortable="\'registration_date\'">
						{{entry.registration_date}}
					</td>
				</tr>
	    	</tbody>
    	</table>

		<a class="export-csv btn btn-primary" ng-mousedown="csv.generate()" ng-href="{{ csv.link() }}" download="test.csv">Export to CSV</a>
    	';

	echo my_wrapper("<div class='wrap'>".$title.$tbl."</div>");

}

function approve(){

	global $wpdb;

	$tbl_name = $wpdb->prefix . "space_competition";

	$date = date('Y-m-d H:i:s');

	$sql = "UPDATE `$tbl_name`
			SET `approved` = %d,
				`last_modified` = '$date'
			WHERE `id` = %d";

	$sql = $wpdb->prepare( 
				$sql, 
				!$_POST['approved'],
				$_POST['id']
			);

	$affected = $wpdb->query( $sql );

	$approved = $wpdb->get_var( $wpdb->prepare( 
						"SELECT `approved`
						FROM `$tbl_name`
						WHERE `id` = %d", 
						$_POST['id']
					)
				);

	echo json_encode($approved);

}

function entries(){

	global $wpdb;

	$tbl_name = $wpdb->prefix . "space_competition";

	$sql = "SELECT * FROM `$tbl_name`";

	$res = $wpdb->get_results( $sql, 'OBJECT' );

	echo $res ? json_encode($res) : '';

}

function approved_entries(){

	global $wpdb;

	$tbl_name = $wpdb->prefix . "space_competition";

	$page = mysql_real_escape_string( $_POST['page'] ) && is_numeric( $_POST['page'] ) ? mysql_real_escape_string( $_POST['page'] ) : 1;

	$total_per_page = 5;
	$start = ( $page - 1 ) * $total_per_page;
	//$end = $total_per_page * $page;

	$sql = "SELECT * 
			FROM `$tbl_name`
			WHERE `approved` = 1
			ORDER BY `registration_date` DESC
			LIMIT $start, $total_per_page";
 
	$res = $wpdb->get_results( $sql, 'OBJECT' );

	echo $res ? json_encode($res) : json_encode(false);

}

function img_crop(){

	upload_dir_check();

	$form_data = array(
		'img_crop' => $_POST['crop']['image'],
		'img_crop_scale' => $_POST['crop']['scale'] ? $_POST['crop']['scale'] : 1,
		'img_crop_pos_x' => $_POST['crop']['pos_x'],
		'img_crop_pos_y' => $_POST['crop']['pos_y'],
		'img_crop_rotate' => 0,
		'width' =>  $_POST['crop']['width'],
		'heigth' =>  $_POST['crop']['height']
	);

	// crop container width
	$c_width = $form_data['width'];

	// Set image to crop
	$path = dirname(__FILE__) . "/uploads";

	$i = new Imagick();

	$filename = $path . "/" . $form_data['img_crop'];

	// read
	$i->readImage( $filename );

	// dimension
	$d = $i->getImageGeometry();

	$ratio = $d['width'] / $d['height'];
	// rad
	/*
	$rad = deg2rad( $form_data['img_crop_rotate'] );
	$new_width = $c_width * sin( $rad ) + $c_width * cos( $rad );
	*/

	$new_width = $c_width;

	// scale
	$i->resizeImage( 
		$new_width * $form_data['img_crop_scale'], 
		0,
		imagick::FILTER_LANCZOS,
		1
	);

	// calculate center
	$center = ( ( $new_width * $form_data['img_crop_scale'] ) - $c_width ) / 2;

	$centerh = ( ( ($ratio*$c_width) * $form_data['img_crop_scale'] ) - ($ratio*$c_width) ) / 2;

	// crop
	$i->cropImage ( 
		$c_width,
		$c_width,
		$center - $form_data['img_crop_pos_x'],
		$center - $form_data['img_crop_pos_y']
	);

	// create new filename
	$cfile = md5( time() . $original );
	$cropped_filename = $cfile . ".jpg";

	// save
	if ( $i->writeImage( $path . "/" . $cropped_filename ) ){

		// clear
		$i->clear();

		$i->destroy();

		// move original file
		rename( $filename, $path . "/" . $cfile . "-original" . ".jpg" );

		return $cropped_filename;

	};

	return false;

}

function save_user_profile_picture(){

	if ( !isset($_POST['user_profile_picture']) || empty($_POST['user_profile_picture']) ) {
		
		return false;

	} elseif (!empty($_POST['crop']) && (is_array($_POST['crop']) && !empty($_POST['crop']['image']) ) ) {

		return img_crop();

	};

	$path = dirname(__FILE__) . "/uploads";

	$filename = md5( time() . $original ) . ".jpg";

	$user_profile_picture = str_replace( "https", "http", strtolower( $_POST['user_profile_picture'] ) );
	$ch = curl_init( $user_profile_picture );
	$fp = fopen( $path . "/" . $filename, 'wb');
	curl_setopt($ch, CURLOPT_FILE, $fp);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_exec($ch);
	curl_close($ch);
	fclose($fp);

	return $filename;

}

function new_entry(){

	$filename = save_user_profile_picture();

	$dateFormated = split('/', $_POST['birthday']);
	$birthday = $dateFormated[2].'-'.$dateFormated[0].'-'.$dateFormated[1];

	if ( $filename ){

		// Save to database
		global $wpdb;

		$tbl_name = $wpdb->prefix . "space_competition";

		$sql = "INSERT INTO `$tbl_name` (
											fb_profile_uid,
											full_name,
											birthday,
											email,
											telephone,
											description,
											photo
										)
				VALUES (
					%d,
					%s,
					%s,
					%s,
					%s,
					%s,
					%s
				)";

		$sql = $wpdb->prepare( 
					$sql,
					$_POST['fb_profile_uid'],
					stripslashes_deep( $_POST['full_name'] ),
					$birthday,
					$_POST['email'],
					$_POST['telephone'],
					stripslashes_deep( $_POST['description'] ),
					$filename
				);

		$affected = $wpdb->query( $sql );

		echo json_encode( $affected );

	} else {

		echo json_encode(false);

	};

	return false;

}

function img_upload(){

	upload_dir_check();

	$path = dirname(__FILE__) . "/uploads";

	$original = strtolower( $_FILES["uploader"]["name"] );
	
	$ext = ".jpg";

	$filename = md5( time() . $original ) . $ext;

	$temp_filename = tempnam( $path , "temp_" );

	move_uploaded_file( $_FILES["uploader"]["tmp_name"], 
	$temp_filename );

	$image = imagecreatefromstring( file_get_contents( $temp_filename ) );

    //$image = autoRotateImageExifImplementation($image, $temp_filename);
	$image = autoRotateImagePelImplementation($image, $temp_filename);

	$dimensions = getimagesize($temp_filename);

	unlink( $temp_filename );

	/* s: make imgs square to make crops easier to calc */
	$wider = $dimensions[0] > $dimensions[1] ? $dimensions[0] : $dimensions[1];
	$dest = imagecreatetruecolor($wider, $wider);

	imagecopy(
				$dest, 		//Destination image link resource.
				$image, 	//Source image link resource.
				$dimensions[1] > $dimensions[0] ? (($dimensions[1]-$dimensions[0])/2) : 0, 			//x-coordinate of destination point. 
				$dimensions[0] > $dimensions[1] ? (($dimensions[0]-$dimensions[1])/2) : 0, //y-coordinate of destination point. 
				0, 		//x-coordinate of source point. 
				0, 		//y-coordinate of source point. 
				$dimensions[0], 	//Source width.
				$dimensions[1] 		//Source height.
			);
	/* e: make imgs square to make crops easier to calc */

	if ( imagejpeg( $dest, $path . "/" . $filename ) ) {

		echo json_encode( $filename );

	};

	return false;

}

function autoRotateImageExifImplementation($image, $file) {
	// requires php-exif module
	$exif = exif_read_data( $file );
	if(!empty($exif['Orientation'])) {
	    switch($exif['Orientation']) {
	        case 8:
	            $image = imagerotate($image,90,0);
	            break;
	        case 3:
	            $image = imagerotate($image,180,0);
	            break;
	        case 6:
	            $image = imagerotate($image,-90,0);
	            break;
	    }
	}
	return $image;
}

function autoRotateImagePelImplementation($image, $file) {

	require_once(dirname(__FILE__) . '/pel/PelJpeg.php');

	$jpeg = new PelJpeg($file);

	$exif = $jpeg->getExif();

	if(empty($exif)) {
		return $image;
	};

	$tiff = $exif->getTiff();

	$ifd0 = $tiff->getIfd();

	$desc = $ifd0->getEntry(PelTag::ORIENTATION);

	if(!empty($desc)) {
	    switch($desc->getValue()) {
	        case 8:
	            $image = imagerotate($image,90,0);
	            break;
	        case 3:
	            $image = imagerotate($image,180,0);
	            break;
	        case 6:
	            $image = imagerotate($image,-90,0);
	            break;
	    }
	}
	return $image;
}

function user_approval_status(){

	global $wpdb;

	$tbl_name = $wpdb->prefix . "space_competition";

	$uid = $_POST['user_profile_id'];

	$sql = "SELECT * 
			FROM `$tbl_name` 
			WHERE `fb_profile_uid` =" . $uid . " 
			ORDER BY `registration_date` DESC
			LIMIT 1";

	$res = $wpdb->get_results( $sql, 'OBJECT' );

	echo $res ? json_encode($res) : json_encode(false);

}

function space_competition_callback(){

	if ( !isset($_POST['option']) ){
		return;
	};

	switch($_POST['option']){

		case 'approve':

			approve();

		break;

		case 'entries':

			entries();

		break;

		case 'approved_entries':

			approved_entries();

		break;

		case 'img_upload':

			img_upload();

		break;

		case 'new_entry':

			new_entry();

		break;

		case 'user_approval_status':

			user_approval_status();

		break;

	};

	exit;
}

add_action( 'wp_ajax_space_competition', 'space_competition_callback' );
add_action( 'wp_ajax_nopriv_space_competition', 'space_competition_callback' );

function upload_dir_check(){

	$dirname = dirname( __FILE__ ) . "/uploads";

	if (!file_exists($dirname)) {
	    
	    mkdir( $dirname, 0755, true);

		$content = "<html><body></body></html>";
		$fp = fopen($dirname . "/index.html","wb");
		fwrite($fp,$content);
		fclose($fp);

	}

}

function my_plugin_install(){
	global $wpdb;

	$tbl_name = $wpdb->prefix . "space_competition";

	$sql = "CREATE TABLE IF NOT EXISTS `$tbl_name` (
	  `id` int(11) NOT NULL AUTO_INCREMENT,
	  `fb_profile_uid` int(11) NOT NULL,
	  `full_name` varchar(150) NOT NULL,
  	  `birthday` date NOT NULL,
	  `email` varchar(150) NOT NULL,
	  `telephone` varchar(100) NOT NULL,
	  `description` text NOT NULL,
	  `photo` varchar(100) NOT NULL,
	  `approved` BOOLEAN NOT NULL DEFAULT '0',
	  `registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	  `last_modified` datetime NOT NULL,
	  primary KEY (`id`)
	);";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

	dbDelta( $sql );

}

register_activation_hook( __FILE__, 'my_plugin_install' );
register_activation_hook( __FILE__, 'upload_dir_check' );

function styles_enqueue() {

	wp_enqueue_style( 'space_competition_stylesheet', plugins_url('space_competition.css', __FILE__) );
	wp_enqueue_style( 'ng_table_stylesheet', '//cdn.jsdelivr.net/angular.ngtable/0.3.1/ng-table.css' );

    wp_enqueue_script('lodash', '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js');
    wp_enqueue_script( 'angularjs', '//cdn.jsdelivr.net/angularjs/1.2.10/angular.min.js' );
    wp_enqueue_script( 'angularjs-router', '//cdn.jsdelivr.net/angularjs/1.2.10/angular-route.min.js' );
    wp_enqueue_script( 'angularjs-router', '//cdn.jsdelivr.net/angularjs/1.2.10/angular-animate.min.js' );
    wp_enqueue_script( 'angularjs-ngtable', '//cdn.jsdelivr.net/angular.ngtable/0.3.1/ng-table.js' );
    wp_enqueue_script( 'angularjs-ngtblexport', plugins_url('ng-table-export.js', __FILE__) );
	wp_enqueue_script( 'angularjs-mysettings', '../../js/mysettings.js' );
    wp_enqueue_script( 'space_competition_script', plugins_url('main.js', __FILE__) );

}

add_action( 'admin_enqueue_scripts', 'styles_enqueue' );