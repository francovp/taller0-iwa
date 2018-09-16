
const API = "http://localhost:8000/tareas/";

var todo = {
	cargar: function(){
		
		$('#titulo').keyup(function() {
			var chars = $(this).val().length;
			if(chars>0 && chars<=5){
				$("#alert-titulo").show();
			}else{
				$("#alert-titulo").hide();
			}
			//$('#cont').html(chars);   
		});
		
		$('#descripcion').keyup(function() {
			var chars = $(this).val().length;
			$('#cont').html(chars);   
			
			if(chars>0 && chars<=10){
				$("#alert-desc").show();
			}else{
				$("#alert-desc").hide();
			}
		});
		
		$.get(API, function(data, textStatus, jqXHR) {
			var html = "";
			
			for(var i = 0; i < data.length; i++){
				html += "<tr><th scope='row' class='id-tarea'>"+data[i].id+"</th><td class='titulo-tarea'>"+ data[i].titulo +"</td><td class='estado-tarea'>" + data[i].nombre_estado + "</td><td class='desc-tarea' hidden>"+data[i].descripcion+"</td></tr>";
			}
			
			$("#todo-table tbody").append(html);
			
			$("#todo-table tbody tr").on("click", function() {
				var titulo =  $(this).find(".titulo-tarea").text();
				var estado = $(this).find(".estado-tarea").text();
				var id = $(this).find(".id-tarea").text();
				var desc = $(this).find(".desc-tarea").text();
				
				$("#detalle-tarea").html("<h1>"+id+" "+titulo+"</h1><p>"+desc+"</p>");
				
				if(estado == "Creada"){
					$("#detalle-tarea").append("<button class='btn btn-primary' id='cambiar-estado'>Pasar a estado En Proceso</button>");
				}
				if(estado == "En Proceso"){
					$("#detalle-tarea").append("<button class='btn btn-primary' id='cambiar-estado'>Pasar a estado Terminada</button>");
				}
				
				$("#detalle-tarea #cambiar-estado").on("click",cambiarEstado);
					
			});
			console.log("ok");
			console.log(data);

		}).fail(function(x) {
			console.log("Error");
			console.log(x);
		});
	},
	cambiarEstado: function(idTarea){
		$.ajax({
			url: API+idTarea,
			type: 'PUT',
			success: function(res) {
			}
		});
	},
	nuevaTarea: function(){
		$.ajax({
			url: API,
			type: 'POST',
			success: function(res) {
			}
		});
	},
	validarForm: function(){
		
		
	},
	filtrar: function(){
	},
	modificarTarea: function(){
	}
};

$().ready(todo.cargar);