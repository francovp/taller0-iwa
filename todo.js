
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

      	$("#modificar-tarea").hide();
				
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
				html += "<tr><th scope='row' class='id-tarea'>"+data[i].id+"</th><td class='titulo-tarea'><a href='#'>"+ data[i].titulo +"</a></td><td class='estado-tarea'>" + data[i].nombre_estado + "</td><td class='desc-tarea' hidden>"+data[i].descripcion+"</td></tr>";
			}
			
			$("#todo-table tbody").html(html);
			
			$("#todo-table tbody tr a").on("click", function() {
              var contexto = $(this).parent().parent();
              var titulo = contexto.find(".titulo-tarea").text();
              var estado = contexto.find(".estado-tarea").text();
              var id = contexto.find(".id-tarea").text();
              var desc = contexto.find(".desc-tarea").text();
              var nuevoEstado = estado;

              var selected = contexto.hasClass("highlight");
              $("#todo-table tbody tr").removeClass("highlight");
              if (!selected) {
                contexto.addClass("highlight");
              }

              $("#detalle-tarea").html("<h1>" + id + " " + titulo + "</h1><p>" + desc + "</p>");

              if (estado == ESTADOS[0].nombre) {
                $("#detalle-tarea").append("<button class='btn btn-primary' id='cambiar-estado'>Pasar a estado En Proceso</button>");
                nuevoEstado = ESTADOS[1].id;
              }
              if (estado == ESTADOS[1].nombre) {
                $("#detalle-tarea").append("<button class='btn btn-primary' id='cambiar-estado'>Pasar a estado Terminada</button>");
                nuevoEstado = ESTADOS[2].id;
              }
              $("#detalle-tarea").on("click", "#cambiar-estado", function () {
                todo.cambiarEstado(id, nuevoEstado, titulo, desc);
              });

              $("#type-form").val(2); // Cambiar formulario a tipo modificar

              $("#crear-tarea").hide();
              $("#modificar-tarea").show();
              $("#limpiar-form").show();

              console.log("id: ", id);
              console.log("desc: ", desc);
              console.log("titulo: ", titulo);
              console.log("type-form: ", $("#type-form").val());

              $("#titulo").val(titulo);
              $("#descripcion").val(desc);

              $("#form-todo").on("click", "#modificar-tarea", function () {
                var nuevoTitulo = $("#titulo").val();
                var nuevaDesc = $("#descripcion").val();
                console.log("nuevoTitulo: ", nuevoTitulo);
                console.log("nuevoDesc: ", nuevaDesc);
                console.log("id: ", id);
                console.log("estado: ", estado);

                todo.cambiarEstado(id, estado, nuevoTitulo, nuevaDesc);

              });

              $('html,body').animate({scrollTop: $("#detalle-tarea").offset().top}, 'slow');

              $("#limpiar-form").prop("disabled",false);

              console.log("ok");
              console.log(data);
            });

		}).fail(function(x) {
			console.log("Error");
			console.log(x);
		});

		$("#form-todo").on("click", "#crear-tarea", function(){
          todo.nuevaTarea();
		});

		  $("#form-todo").on("click", "#limpiar-form", function(){
            $("#titulo").val();
            $("#descripcion").val();
            $("#modificar-tarea").hide();
            $("#limpiar-form").hide();
            $("#crear-tarea").show();
		  });
		
	},
	cambiarEstado: function(id,nuevoEstado,titulo,desc){
		var url = API+id+"/";
		var data = {
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

				
				if(nuevoEstado == 1){
					$("#cambiar-estado").text("Pasar a estado Terminada");
					$("#detalle-tarea").on("click","#cambiar-estado",function(){
						todo.cambiarEstado(id,nuevoEstado+1,titulo,desc);
					});
				}
				if(nuevoEstado == 2){
					$("#cambiar-estado").remove();
				}
				todo.cargar();
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
				todo.cargar();
			},
			error: function(err) {
				console.log(err.responseText);
			}
		});
	},
	validarForm: function(){
		if(($("#titulo").val() != '' && $("#descripcion").val() != '') && ($("#alert-titulo").is(":hidden") && $("#alert-desc").is(":hidden"))){
			$("#crear-tarea").prop("disabled",false);
          	$("#modificar-tarea").prop("disabled",false);
		}else{
			$("#crear-tarea").prop("disabled",true);
          	$("#modificar-tarea").prop("disabled",true);
		}
		
	},
	filtrar: function(){
		var inputFiltro, filtro, tabla, tr, td, i;
		inputFiltro = document.getElementById("filtro");
		filtro = inputFiltro.value.toUpperCase();
		tabla = document.getElementById("todo-table");
		tr = tabla.getElementsByTagName("tr");
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0];
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
