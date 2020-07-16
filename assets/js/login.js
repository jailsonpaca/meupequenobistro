$("#frmLoginPdv").on("submit", function (event) {
   event.stopPropagation();
   event.preventDefault();

   var obj = {
       "login"  : $("#username").val(),
       "senha"  : $("#password").val()
   }

    $.ajax({
        url     : GLOBAL_LINK + "loginPDV.php",
        type    : "POST",
        data    : obj
    }).done(function (objRetorno) {
        objRetorno = $.parseJSON(objRetorno);
        if (objRetorno.sucesso) {
            $("#frmLoginPdv").trigger("reset");
            $("#dvMensagem").html('<div class="alert alert-success" role="alert">Login efetuado com sucesso.</div>');
            window.setTimeout(function () {
                $("#dvMensagem").html("");
                window.location.href = GLOBAL_LINK + "home";
            }, 4000);
        } else {
            $("#dvMensagem").html('<div class="alert alert-danger" role="alert">Dados inválidos.</div>');
        }

        $('html, body').animate({scrollTop: 0}, 'slow');
    });
});

$(".btnAddProduto").click(function () {

    var intProduto = $(this).attr("data-id"),
        strHtmlCheck = "",
        intI = 1;

    $.ajax({
        url     : GLOBAL_LINK + "index.php?acao=buscarDadoProduto",
        type    : "POST",
        data    : {
            "produto" : intProduto
        }
    }).done(function (objRetorno) {
        objRetorno = $.parseJSON(objRetorno);
        if (objRetorno.sucesso) {
            $("#txtModalAdicionarProdutoIdProduto").val(intProduto);
            //$("#dvModalQuantidade").find("tbody").find("#txtModalAdicionarProdutoNome").val(objRetorno.resultado.nome);
            //$("#dvModalQuantidade").find("tbody").find("#txtModalAdicionarProdutoQuantidade").val(1);
            $("#txtModalAdicionarProdutoNome").html(objRetorno.resultado.nome);
            $("#txtModalAdicionarProdutoQuantidade").val(1);
            buscarInsumoProduto(function (objRetorno) {
                if (objRetorno.resultado != "") {
                    strHtmlCheck += "<div class='col-xs-12'><h5 class='modal-title'>Ítem " + intI + ":</h5></div>";
                    $.each(objRetorno.resultado, function (intContador, objItem) {
                        strHtmlCheck += "<div class='col-lg-6 col-xs-6'>" +
                                        "   <div class='form-check'>" +
                                        "       <input type='checkbox' name='insumoProd[]' value='" + objItem.nome + "' class='form-check-input chkExcluirProducao' id='" + objItem.id + intI + "' checked data-valor='" + objItem.nome + "' data-item='" + intI + "'>" +
                                        "       <label class='form-check-label' for='" + objItem.id + intI + "'>" + objItem.nome + "</label>" +
                                        "   </div>" +
                                        "</div>";
                    });
                    strHtmlCheck += "<div class='col-xs-12'>&nbsp;</div>";
                }
                $("#dvModalQuantidade").find("#dvInsumoProduto").html(strHtmlCheck);
                $("#dvModalQuantidade").modal("show");
            });
        }
    });
});

$("#dvModalQuantidade").on("change", "#txtModalAdicionarProdutoQuantidade", function () {
    var intQuantidade = $(this).val(),
        strHtmlCheck = "",
        intI = 0;

    buscarInsumoProduto(function (objRetorno) {
        if (objRetorno.resultado != "") {
            for(intI = 1; intI <= intQuantidade; intI++) {
                strHtmlCheck += "<div class='col-xs-12'><h5 class='modal-title'>Ítem " + intI + ":</h5></div>";
                $.each(objRetorno.resultado, function (intContador, objItem) {
                    strHtmlCheck += "<div class='col-lg-6 col-xs-6'>" +
                                    "   <div class='form-check'>" +
                                    "       <input type='checkbox' name='insumoProd[]' value='" + objItem.nome + "' class='form-check-input chkExcluirProducao' id='" + objItem.id + intI + "' checked data-valor='" + objItem.nome + "' data-item='" + intI + "'>" +
                                    "       <label class='form-check-label' for='" + objItem.id + intI + "'>" + objItem.nome + "</label>" +
                                    "   </div>" +
                                    "</div>";
                });
                if(intQuantidade == intI) {
                  strHtmlCheck += "<div class='col-xs-12'>&nbsp;</div>";
                } else {
                  strHtmlCheck += "<div class='col-xs-12'>&nbsp;<hr></div>";
                }
            }
        }
        $("#dvModalQuantidade").find("#dvInsumoProduto").html(strHtmlCheck);
    });
});


$("#dvModalQuantidade").on("click", "#txtModalAdicionarProdutoBtnAdicionar", function (event) {
    $(this).attr('disabled', 'disabled');
    event.preventDefault();
    var strObsPedido = "",
        intIndiceItem = 0;

    $("input:checkbox:not(:checked)").each(function () {
        if ($(this).attr("data-item") != intIndiceItem) {
            intIndiceItem = $(this).attr("data-item");
            strObsPedido += (strObsPedido != "" ? "<br/>" : "") + "ÍTEM " + intIndiceItem + " SEM: ";
        }
        strObsPedido += $(this).attr("data-valor") + " ,";
    });

    console.log(strObsPedido);

    $.ajax({
        url     : GLOBAL_LINK + "index.php?acao=adicionarCarrinho",
        type    : "POST",
        data    : {
            "quantidade"    : $("#txtModalAdicionarProdutoQuantidade").val(),
            "produto"       : $("#txtModalAdicionarProdutoIdProduto").val(),
            "observacao"    : strObsPedido
        }
    }).done(function (objRetorno) {
        objRetorno = $.parseJSON(objRetorno);
        if (objRetorno.sucesso) {
            $("#dvModalAdicionarProdutoMensagem").html("<div class='alert alert-success'>Ítem adicionado com sucesso!</div>");
            window.setTimeout(function () {
                $("#dvModalAdicionarProdutoMensagem").html("");
                $("#dvModalQuantidade").modal("hide");
                window.location.reload();
            }, 3000);
        } else {
            $("#dvModalAdicionarProdutoMensagem").html("<div class='alert alert-danger'>Erro ao adicionar ítem, favor tentar novamente!</div>");
        }
    });
});

function buscarInsumoProduto(callback) {
    $.ajax({
        url     : GLOBAL_LINK + "index.php?acao=buscarInsumoProduto",
        type    : "POST",
        data    : {
            "produto" : $("#txtModalAdicionarProdutoIdProduto").val()
        }
    }).done(function (objRetorno) {
        objRetorno = $.parseJSON(objRetorno);
        if (objRetorno.sucesso) {
            callback(objRetorno);
        }
    });
}

/*$(".novodep").click(function (e) {
 var departamento = $(this).attr("id");
 alert(departamento);
 if(departamento != "") {
  $("#novosub"+departamento).css("display", "block");
 }
});*/