
const API = "http://localhost:8000/tareas/";
const ESTADOS = [{
        "id": 0,
        "nombre": "Creada"
    },
    {
        "id": 1,
        "nombre": "En Proceso"
    },
    {
        "id": 2,
        "nombre": "Terminada"
}];

var todo = {
	cargar: function(){
				
		$('#titulo').keyup(function() {
			var chars = $(this).val().length;
			if(chars>0 && chars<=5){
				$("#alert-titulo").show();
			}else{
				$("#alert-titulo").hide();
			}
			todo.validarForm();

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
			todo.validarForm();

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
				var nuevoEstado;
				
				$("#detalle-tarea").html("<h1>"+id+" "+titulo+"</h1><p>"+desc+"</p>");
				
				if(estado == ESTADOS[0].nombre){
					$("#detalle-tarea").append("<button class='btn btn-primary' id='cambiar-estado'>Pasar a estado En Proceso</button>");
					nuevoEstado = ESTADOS[1].id;
				}
				if(estado == ESTADOS[1].nombre){
					$("#detalle-tarea").append("<button class='btn btn-primary' id='cambiar-estado'>Pasar a estado Terminada</button>");
					nuevoEstado = ESTADOS[2].id;
				}
				$("#detalle-tarea").on("click","#cambiar-estado",function(){
					todo.cambiarEstado(id,nuevoEstado,titulo,desc);
				});
					
			});
			console.log("ok");
			console.log(data);

		}).fail(function(x) {
			console.log("Error");
			console.log(x);
		});
		
		$("#form-todo").submit(function() {
			todo.nuevaTarea();
		});
		
	},
	cambiarEstado: function(id,nuevoEstado,titulo,desc){
		var url = API+id+"/";
		var data ={
			"titulo": titulo,
			"descripcion": desc,
			"estado": nuevoEstado
		}
		$.ajax({
			url: url,
			type: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify(data), 
			success: function(res) {
				console.log(res);
			},
			error: function(err) {
				console.log(err.responseText);
			}
		});
	},
	nuevaTarea: function(){
		
		var form = $("#form-todo");
		/*var data ={
			"titulo": titulo,
			"descripcion": desc,
			"estado": estado
		}*/
		$.ajax({
			url: API,
			type: 'POST',
			data: form.serialize(),
			success: function(res) {
				console.log(res);
			},
			error: function(err) {
				console.log(err.responseText);
			}
		});
	},
	validarForm: function(){
		if(($("#titulo").val() != '' && $("#descripcion").val() != '') && ($("#alert-titulo").is(":hidden") && $("#alert-desc").is(":hidden"))){
			$("#crear-tarea").prop("disabled",false);
		}else{
			$("#crear-tarea").prop("disabled",true);
		}
		
	},
	filtrar: function(){
		var inputFiltro, filtro, tabla, tr, td, i;
		inputFiltro = document.getElementById("filtro");
		filtro = inputFiltro.value.toUpperCase();
		tabla = document.getElementById("todo-table");
		tr = tabla.getElementsByTagName("tr");
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[1];
			if (td) {
				if (td.innerHTML.toUpperCase().indexOf(filtro) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}       
		}
	},
	modificarTarea: function(id,estado,titulo,desc){
		
		/*var url = API+id+"/";
		var data ={
			"titulo": titulo,
			"descripcion": desc,
			"estado": estado
		}
		$.ajax({
			url: url,
			type: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify(data), 
			success: function(res) {
				console.log(res);
			},
			error: function(err) {
				console.log(err.responseText);
			}
		});*/
	}
};

$().ready(todo.cargar);