
<?php

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header("Access-Control-Allow-Headers: X-Requested-With");
header("Access-Control-Allow-Origin: http://localhost:4200");
header('Content-Type: application/json; charset=utf-8');
header('P3P: CP="IDC DSP COR CURa ADMa OUR IND PHY ONL COM STA"');


require_once 'vendor/autoload.php';
$app = new \Slim\Slim();
$app->contentType('application/json; charset=utf-8'); 

$db = new mysqli("127.0.0.1", "root", "Asd123456789*", "ayudalaboraldb");
$db->query("SET NAMES 'utf8'");


$app->get("/Login/:user/:pass/:type", function($user, $pass, $type) use($db, $app) {
	// sleep(3);
	$query = $db->query("SELECT * FROM tbllogin WHERE userName = '$user' and password = '$pass' and type = '$type';");
	$user = $query->fetch_assoc();

	if ($query->num_rows == 1) {
		$result = array("status" => "success",
			"data" => $user);
	} else {
		$result = array(
			"status" => "error",
			"message" => "Login incorrecto.");
	}

	echo json_encode($result);
});

$app->post("/Registro", function() use($db, $app) {

	$json = $app->request->post("json");
	$data = json_decode($json, true);
    $saved = false;
	
	$querylog = $db->query("SELECT * FROM tbllogin WHERE userName = '{$data["UserNameR"]}';");
	$log = $querylog->fetch_assoc();

	if ($querylog->num_rows >= 1) {
	 	$result = array(
			"status" => "error",
			"message" => "El correo electronico ya existe en el sistema.");
		} else {
			$query = "INSERT INTO tbllogin (id,userName,password,type) VALUES(NULL,"
			. "'{$data["UserNameR"]}',"
			. "'{$data["PasswordR"]}',"
			. "'{$data["type"]}' "
			. ")";
	
	$insert = $db->query($query);	

	if ($insert) {

		$queryusu = $db->query("SELECT id FROM tbllogin WHERE userName = '{$data["UserNameR"]}' and password = '{$data["PasswordR"]}' ;");
		$user = $queryusu->fetch_assoc();
	
	
		if ($data["type"] == "col"){
            $query1 = "INSERT INTO tblcolaboradores (id,nombreContacto,loginId) VALUES(NULL,"
			. "'{$data["Nombres"]}', "
			. "{$user['id']}"
			. ")";

		$insert1 = $db->query($query1);

		if ($insert1) {
			$saved = true;
		}

		}else{

			$query2 = "INSERT INTO tblusuarios (id,nombres,loginId,activo) VALUES(NULL,"
			. "'{$data["Nombres"]}', "
			. "{$user['id']},1"
			. ")";
		$insert2 = $db->query($query2);

			if ($insert2) {
				$saved = true;
			}
		}

	} else {
		$result = array("status" => "error", "message" => "Error al crear el login en el servidor");
	}

	if ($saved) {
		$result = array("status" => "success",
			"message" => $data["UserNameR"]);
	} else {
		$result = array("status" => "error", "message" => "Error al crear usuario en el servidor");
	}
}	
	echo json_encode($result);
});

$app->get("/ConsultarUsuario/:user", function($user) use($db, $app) {
	$query = $db->query("SELECT u.id,u.nombres,l.userName,'' as password,u.fechaDisponibilidad,u.ciudad, u.areaTrabajo, u.campoEspecialidad,u.conocimientos,u.profesion,u.especializacion,u.competencias,u.comentarios,u.CV, u.activo FROM tblusuarios u inner join tbllogin l on u.loginId = l.id Where l.userName = '{$user}' ORDER BY id ASC;");
	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;
       
	}
  
   if ($query->num_rows >= 1) {

    $result = array("status" => "success",
		"data" => $allusers);

  	}else {
		$result = array(
			"status" => "error",
			"message" => "Error en la consulta");
	}
         echo json_encode($result);
   
});

$app->get("/ConsultarUsuarioxId/:id/:user", function($id,$user) use($db, $app) {

	$queryusu = $db->query("SELECT type FROM tbllogin WHERE userName = '{$user}';");
	$user = $queryusu->fetch_assoc();
	
	if ($user['type'] == "col"){
		$query = $db->query("SELECT u.id,u.nombres,l.userName,'' as password,u.fechaDisponibilidad,u.ciudad, u.areaTrabajo, u.campoEspecialidad,u.conocimientos,u.profesion,u.especializacion,u.competencias,u.comentarios,u.CV, u.activo FROM tblusuarios u inner join tbllogin l on u.loginId = l.id Where u.id = {$id} ORDER BY id ASC;");
		$allusers = array();

		while ($fila = $query->fetch_assoc()) {
			$allusers[] = $fila;
		
		}
	
	if ($query->num_rows >= 1) {

		$result = array("status" => "success",
			"data" => $allusers);

		}else {
			$result = array(
				"status" => "error",
				"message" => "Error en la consulta");
		}
	
	}else{
		$result = array(
			"status" => "error",
			"message" => "El usuario no es un colaborador.");
	
	}

       echo json_encode($result);
   
});

$app->get("/ConsultarUsuarios/:user", function($user) use($db, $app) {

	$queryusu = $db->query("SELECT type FROM tbllogin WHERE userName = '{$user}';");
	$user = $queryusu->fetch_assoc();
	
	if ($user['type'] == "col"){
		$query = $db->query("SELECT u.id,u.nombres,l.userName,'' as password,u.fechaDisponibilidad,u.ciudad, u.areaTrabajo, u.campoEspecialidad,u.conocimientos,u.profesion,u.especializacion,u.competencias,u.comentarios,u.CV, u.activo FROM tblusuarios u inner join tbllogin l on u.loginId = l.id ORDER BY id DESC;");
		$allusers = array();

		while ($fila = $query->fetch_assoc()) {
			$allusers[] = $fila;		
		}
	
	if ($query->num_rows >= 1) {

		$result = array("status" => "success",
			"data" => $allusers);

		}else {
			$result = array(
				"status" => "error",
				"message" => "Error en la consulta");
		}
	
	}else{
		$result = array(
			"status" => "error",
			"message" => "El usuario no es un colaborador.");
	
	}

       echo json_encode($result);
   
});


$app->get("/ConsultarUsuariosActivos/:user", function($user) use($db, $app) {

	$queryusu = $db->query("SELECT type FROM tbllogin WHERE userName = '{$user}';");
	$user = $queryusu->fetch_assoc();
	
	if ($user['type'] == "col"){
	
		$query = $db->query("SELECT u.id,u.nombres,l.userName,'' as password,u.fechaDisponibilidad,u.ciudad, u.areaTrabajo, u.campoEspecialidad,u.conocimientos,u.profesion,u.especializacion,u.competencias,u.comentarios,u.CV, u.activo FROM tblusuarios u inner join tbllogin l on u.loginId = l.id where u.activo=1 ORDER BY id DESC;");
		$allusers = array();

		while ($fila = $query->fetch_assoc()) {
			$allusers[] = $fila;		
		}
	
	if ($query->num_rows >= 1) {

		$result = array("status" => "success",
			"data" => $allusers);

		}else {
			$result = array(
				"status" => "error",
				"message" => "Error en la consulta");
		}
	
	}else{
		$result = array(
			"status" => "error",
			"message" => "El usuario no es un colaborador.");
	
	}

       echo json_encode($result);
   
});



$app->get("/ConsultarColaborador/:user", function($user) use($db, $app) {
	$query = $db->query("SELECT u.id,u.nombreContacto,l.userName,'' as password,u.ciudad, u.empresa, u.cargo,u.celular FROM tblcolaboradores u inner join tbllogin l on u.loginId = l.id Where l.userName = '{$user}' ORDER BY id ASC;");
	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($query->num_rows >= 1) {
    $result = array("status" => "success",
		"data" => $allusers);

  	}else {
		$result = array(
			"status" => "error",
			"message" => "Error en la consulta");
	}
         echo json_encode($result);
   
});


$app->post("/Actualizar-Usuario/:id", function($id) use($db, $app) {
	$json = $app->request->post("json");
	$data = json_decode($json, true);

	$query = "UPDATE tblusuarios SET "
			. "nombres = '{$data["nombres"]}', "
		//	. "userName = '{$data["userName"]}', "
			. "fechaDisponibilidad = '{$data["fechaDisponibilidad"]}', "
			. "ciudad = '{$data["ciudad"]}', "
			. "areaTrabajo = '{$data["areaTrabajo"]}', "
			. "campoEspecialidad = '{$data["campoEspecialidad"]}', "			
			. "conocimientos = '{$data["conocimientos"]}', "
			. "profesion = '{$data["profesion"]}', "			
			. "especializacion = '{$data["especializacion"]}', "
			. "competencias = '{$data["competencias"]}', "	
			. "CV = '{$data["CV"]}' "
			. " WHERE id={$id}";
	$update = $db->query($query);

	if ($update) {
		$result = array("status" => "success", "message" => "El usuario se ha actualizado correctamente!!!");
	} else {
		$result = array("status" => "error", "message" => "El usuario no se actualizo debido a un error en el servidor.");
	}

	echo json_encode($result);
});


$app->post("/Actualizar-Colaborador/:id", function($id) use($db, $app) {
	$json = $app->request->post("json");
	$data = json_decode($json, true);

	$query = "UPDATE tblcolaboradores SET "
			. "nombreContacto = '{$data["nombreContacto"]}', "
		//	. "userName = '{$data["userName"]}', "
			. "ciudad = '{$data["ciudad"]}', "
			. "empresa = '{$data["empresa"]}', "
			. "cargo = '{$data["cargo"]}', "			
			. "celular = '{$data["celular"]}' "
			. " WHERE id={$id}";
	$update = $db->query($query);

	if ($update) {
		$result = array("status" => "success", "message" => "El usuario se ha actualizado correctamente!!!");
	} else {
		$result = array("status" => "error", "message" => "El usuario no se actualizo debido a un error en el servidor.");
	}

	echo json_encode($result);
});


$app->post("/CrearOportunidad", function() use($db, $app) {

	$json = $app->request->post("json");
	$data = json_decode($json, true);
    
	$query = "INSERT INTO tbloportunidades (id,areaTrabajo,especialidad,ciudad,profesion,experiencia,colaborador,fecha,empresa,activo,descripcion) VALUES(NULL,"
			. "'{$data["areaTrabajo"]}',"
			. "'{$data["especialidad"]}',"
			. "'{$data["ciudad"]}',"
			. "'{$data["profesion"]}',"
			. "'{$data["experiencia"]}',"
			. "'{$data["colaborador"]}',"
			. "'{$data["fecha"]}',"
			. "'{$data["empresa"]}',"
			. "1,"
			. "'{$data["descripcion"]}'"		
			. ")";
	
	$insert = $db->query($query);	

	if ($insert) {
		$result = array("status" => "success",
		"message" => "Información guardada correctamente.");
	} else {
		$result = array("status" => "error", "message" => "Error al crear la oportunidad en el servidor");
	}
	
	echo json_encode($result);
});


$app->post("/CrearRecomendacion", function() use($db, $app) {

	$json = $app->request->post("json");
	$data = json_decode($json, true);
		
	$queryCons = $db->query("SELECT * FROM tblrecomendaciones  Where oportunidadid = {$data["oportunidadid"]} And usuarioid = {$data["usuarioid"]} ORDER BY id ASC;");
	$allusers = array();

	while ($fila = $queryCons->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($queryCons->num_rows >= 1) {
    $result = array("status" => "error",
	"message" => "Ya han recomendado a este usuario.");

	}else{


        $desc = "Te han recomendado para una oportunidad en el área de {$data["areaTrabajo"]}, en la ciudad de {$data["ciudad"]}, en la empresa {$data["empresa"]}";

		$query2 = "INSERT INTO tblactividades (id,mensaje,afectado,fecha) VALUES(NULL,"
		. "'{$desc}',"
		. "'{$data["afectado"]}',"
		. "'{$data["fecha"]}'"		
		. ")";

       $insert2 = $db->query($query2);

	   if ($insert2) {

				$query = $db->query("SELECT id FROM tblactividades WHERE afectado = '{$data["afectado"]}' And fecha = '{$data["fecha"]}' And mensaje = '{$desc}';");
				$allact = $query->fetch_assoc();
	
					$query = "INSERT INTO tblrecomendaciones (id,oportunidadid,usuarioid,actividadid,fecha) VALUES(NULL,"
					. "{$data["oportunidadid"]},"
					. "{$data["usuarioid"]},"
					. "{$allact["id"]},"
					. "'{$data["fecha"]}'"		
					. ")";

			$insert = $db->query($query);	

			if ($insert) {
				$result = array("status" => "success",
				"message" => "Información guardada correctamente.");
			} else {
				$result = array("status" => "error", "message" => "Error al crear la recomendación en el servidor");
			}


	   }else{
			$result = array("status" => "error", "message" => "Error al crear la actividad de la recomendación.");
	
	   }
	
	}
	
	echo json_encode($result);
});


$app->get("/ConsultarOportunidades/:user", function($user) use($db, $app) {

	$queryusu = $db->query("SELECT adm FROM tbllogin WHERE userName = '{$user}';");
	$userc = $queryusu->fetch_assoc();
	
	if ($userc['adm'] == 1){
		$qry = "SELECT * FROM tbloportunidades  ORDER BY id ASC;";
	}else{
		$qry = "SELECT * FROM tbloportunidades Where colaborador = '{$user}' ORDER BY id ASC;";
	
     }
		$query = $db->query($qry);


	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($query->num_rows >= 1) {
    $result = array("status" => "success",
		"data" => $allusers);

  	}else {
		$result = array(
			"status" => "error",
			"message" => "Error en la consulta");
	}
         echo json_encode($result);
   
});

$app->get("/ConsultarOportunidadesXId/:id", function($id) use($db, $app) {
	$query = $db->query("SELECT * FROM tbloportunidades  Where id = {$id};");
	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($query->num_rows == 1) {
    $result = array("status" => "success",
		"data" => $allusers);

  	}else {
		$result = array(
			"status" => "error",
			"message" => "Error en la consulta");
	}
         echo json_encode($result);
   
});

$app->get("/ConsultarOportunidades", function() use($db, $app) {
	$query = $db->query("SELECT * FROM tbloportunidades Where activo=1 Order by fecha desc;");
	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($query->num_rows >= 1) {
    $result = array("status" => "success",
		"data" => $allusers);

  	}else {
		$result = array(
			"status" => "error",
			"message" => "Error en la consulta");
	}
         echo json_encode($result);
   
});


$app->get("/ValidarIngreso/:user/:type", function($user, $type) use($db, $app) {
	$query = $db->query("SELECT * FROM tbllogin Where userName = '{$user}' And type = '{$type}';");
	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($query->num_rows == 1) {
    $result = array("status" => "true");

  	}else {
		$result = array(
			"status" => "false");
	}
         echo json_encode($result);
   
});


$app->post("/Actualizar-Oportunidad/:id", function($id) use($db, $app) {
	$json = $app->request->post("json");
	$data = json_decode($json, true);

	$query = "UPDATE tbloportunidades SET "
			. "	areaTrabajo = '{$data["areaTrabajo"]}', "
			. "especialidad = '{$data["especialidad"]}', "
			. "ciudad = '{$data["ciudad"]}', "
			. "profesion = '{$data["profesion"]}', "
			. "experiencia = '{$data["experiencia"]}', "
			. "fecha = '{$data["fecha"]}', "		
			. "empresa = '{$data["empresa"]}', "			
			. "descripcion = '{$data["descripcion"]}', "			
			. "colaborador = '{$data["colaborador"]}' "
			. " WHERE id={$id}";
	$update = $db->query($query);

	if ($update) {
		$result = array("status" => "success", "message" => "La oportunidad se ha actualizado correctamente!!!");
	} else {
		$result = array("status" => "error", "message" => "La oportunidad no se actualizo debido a un error en el servidor.");
	}

	echo json_encode($result);
});


$app->post("/BloquearOportunidad/:id", function($id) use($db, $app) {
	$json = $app->request->post("json");
	$data = json_decode($json, true);

	$query = "UPDATE tbloportunidades SET "
			. "	activo = {$data["activo"]} "
			. " WHERE id={$id}";
	$update = $db->query($query);

	if ($update) {
		$result = array("status" => "success", "message" => "Oportunidad bloqueada.");
	} else {
		$result = array("status" => "error", "message" => "La oportunidad no se bloqueo.");
	}

	echo json_encode($result);
});


$app->post("/BloquearUsuario/:id", function($id) use($db, $app) {
	$json = $app->request->post("json");
	$data = json_decode($json, true);

	$query = "UPDATE tblusuarios SET "
			. "	activo = {$data["activo"]} "
			. " WHERE id={$id}";
	$update = $db->query($query);

	if ($update) {
		$result = array("status" => "success", "message" => "Usuario bloqueada.");
	} else {
		$result = array("status" => "error", "message" => "El usuario no se bloqueo.");
	}

	echo json_encode($result);
});


$app->get("/ConsultarPersonasOportunidades/:id", function($id) use($db, $app) {
	$query = $db->query("SELECT u.id,u.nombres,l.userName,u.fechaDisponibilidad,u.ciudad,u.areaTrabajo, u.campoEspecialidad,u.conocimientos,u.profesion, u.especializacion, u.competencias, u.CV,o.fecha FROM tbloportunidaxusuario o inner join tblusuarios u on o.usuarioid = u.id inner join tbllogin l on u.loginId = l.id Where o.oportunidadid={$id} order by o.fecha ASC;");
	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($query->num_rows >= 1) {
    $result = array("status" => "success",
		"data" => $allusers);

  	}else {
		$result = array(
			"status" => "error",
			"message" => "No se encontraron datos");
	}
         echo json_encode($result);
   
});

$app->get("/ConsultarRecomendaciones/:id", function($id) use($db, $app) {

	$query = $db->query("SELECT u.* FROM tblrecomendaciones r inner join tblusuarios u on r.usuarioid = u.id WHERE r.oportunidadid = {$id} order by r.fecha DESC;");
	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($query->num_rows >= 1) {
    $result = array("status" => "success",
		"data" => $allusers);

  	}else {
		$result = array(
			"status" => "error",
			"message" => "No se encontraron datos");
	}
         echo json_encode($result);
   
});



$app->get("/ConsultarActividadesXUsuario/:user", function($user) use($db, $app) {
	$query = $db->query("SELECT * FROM tblactividades WHERE afectado = '{$user}' order by fecha DESC;");
	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($query->num_rows >= 1) {
    $result = array("status" => "success",
		"data" => $allusers);

  	}else {
		$result = array(
			"status" => "error",
			"message" => "No se encontraron datos");
	}
         echo json_encode($result);
   
});


$app->post("/InteresOportunidad/:usern", function($usern) use($db, $app) {
	$json = $app->request->post("json");
	$data = json_decode($json, true);

	$query = $db->query("SELECT * FROM tbloportunidaxusuario Where oportunidadid={$data['oportunidadid']} And usuarioid={$data['usuarioid']};");
	$allusers = array();

	while ($fila = $query->fetch_assoc()) {
		$allusers[] = $fila;       
	}
  
   if ($query->num_rows == 1) {
    $result = array("status" => "error",
	"message" => "Ya te has inscrito.");
   }else{
		
	$queryusu = $db->query("SELECT ciudad,areaTrabajo,empresa FROM tbloportunidades WHERE id = {$data['oportunidadid']};");
	$user = $queryusu->fetch_assoc();

		$query = "INSERT INTO tbloportunidaxusuario (id,oportunidadid,usuarioid	,fecha) VALUES(NULL,"
				. "'{$data["oportunidadid"]}',"
				. "'{$data["usuarioid"]}',"
				. "'{$data["fecha"]}'"		
				. ")";
		
		$insert = $db->query($query);

		if ($insert) {

			$desc = "Has indicado que estas interesado en una oferta en el área de {$user['areaTrabajo']}, de la empresa {$user['empresa']}, en la ciudad de {$user['ciudad']}.";
		
			$query2 = "INSERT INTO tblactividades (id,mensaje,afectado,fecha) VALUES(NULL,"
			. "'{$desc}',"
			. "'{$usern}',"
			. "'{$data["fecha"]}'"		
			. ")";
	
	            $insert2 = $db->query($query2);

			$result = array("status" => "success", "message" => "Información Guardada.");
		} else {
			$result = array("status" => "error", "message" => "La información no se guardo.");
		}
   }

	echo json_encode($result);
});





$app->post("/upload-file", function() use($db, $app) {
	
	$result = array("status" => "error", "message" => "The file could not be uploaded");

	if (isset($_FILES["uploads"])) {
		$piramideUploader = new PiramideUploader();

		$upload = $piramideUploader->upload("pdf", "uploads", "uploads", array("image/jpeg","application/pdf"));
		$file = $piramideUploader->getInfoFile();
		$file_name = $file["complete_name"];
		
		if (isset($upload) && $upload["uploaded"] == false) {
			$result = array("status" => "error",
				"message" => $upload["error"]);
		} else {
			$result = array("status" => "success",
				"message" => "Fichero subido correctamente",
				"filename"=>$file_name);
		}
	}
	
	echo json_encode($result);
});

$app->get("/download-file/:id", function($id) use($db, $app) {
	
	$fileName = $id;
	//echo $fileName;
	$filePath = 'uploads/'.$fileName;
	if(!empty($fileName) && file_exists($filePath)){
    // Define headers
    header("Cache-Control: public");
    header("Content-Description: File Transfer");
    header("Content-Disposition: attachment; filename=$fileName");
    header("Content-Type: application/pdf");
    header("Content-Transfer-Encoding: binary");
    
    // Read the file
    readfile($filePath);
    echo 'true';
	exit;
}else{
    echo 'false';
}
});

$app->run();

?>