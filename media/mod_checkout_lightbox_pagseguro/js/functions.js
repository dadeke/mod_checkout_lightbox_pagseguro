/**
 * @package Checkout Lightbox with PagSeguro
 * @author Deividson Developer
 * @copyright 2017 Deividson (deividson.net)
 * @license GNU/GPLv3 http://www.gnu.org/licenses/gpl-3.0.html
 */

/* Funções utilitárias. */
function getKey(e) {
	return (window.event) ? event.keyCode : e.which;
}

function validaInteiro(letra) {
	return ((letra >= 48) && (letra <= 57)) || ((letra >= 96) && (letra <= 105));
}

function vnumber(e) {
	var tecla = getKey(e);
	if(tecla > 47 && tecla < 58) return true;
	else {
		if (tecla == 8 || tecla == 0) return true;
		else  return false;
	}
}

/* Funções de formatação. */
var MASCARA_CEP = '#####-###';
var MASCARA_INTEIRO = '###.###.###.###.###';
var MASCARA_REAL = MASCARA_INTEIRO + ',##';

function formata_onkeyup(evento, caixaTexto, mascara, alinhamento) {
	var retorno = '';
	var letra = getKey(evento);
	if(validaInteiro(letra) || letra == 8 || letra == 46) {
		retorno = formata(caixaTexto, mascara, alinhamento);
	}
	return retorno;
}

function formata(caixaTexto, mascara, alinhamento) {
	caixaTexto.value = formatacao(caixaTexto.value, mascara, alinhamento);
	return caixaTexto.value;
}

function formatacao(valor, mascara, alinhamento) {
	var retorno = "" + valor;
	retorno = retorno.replace(/\D/g,"");
	var tamanho = retorno.length;
	var aux = "";
	if(alinhamento == "D") {
		tamanhoMascara = mascara.length - 1;
		for(i = (tamanho-1); i >= 0; i--) {
			letra = retorno.charAt(i);
			if((letra >= "0") && (letra <= "9")) {
				aux = letra + aux;
				tamanhoAux = aux.length;
				letra = mascara.charAt(tamanhoMascara - tamanhoAux);
				tamanhoSemEspeciais = aux.replace(/\D/g,"").length;
				if((letra != "#") && (tamanho > tamanhoSemEspeciais)) {
					aux = letra + aux;
				}
			}
		}
	}
	else if(alinhamento == "E") {
		for(i = 0; i <= (tamanho-1); i++) {
			letra = retorno.charAt(i);
			if((letra >= "0") && (letra <= "9")) {
				aux += letra;
				letra = mascara.charAt(aux.length);
				if((letra != "#") && (tamanho > (i+1))) {
					aux += letra;
				}
			}
		}
	}
	if(aux != "") {
		retorno = aux;
	}
	return retorno;
}

/* Funções para o pagamento. */
function ProcessarPagSeguro(id, menu_itemid) {
	var button_id = '#buttonpay' + id;
	var loading_gif = '#loading_gif' + id;
	var message_error = '#message_error' + id;
	var quantity = jQuery('#quantity' + id).val();
	var url = 'index.php?option=com_ajax';
	var dataPost = {
		module: "checkout_lightbox_pagseguro",
		format: "json",
		method: "gettokencheckout",
		id: id,
		Itemid: menu_itemid
	};

	jQuery(button_id).prop('disabled', true);
	jQuery(loading_gif).attr('class', '');
	jQuery(message_error).html('');
	jQuery(message_error).attr('class', 'alert alert-danger hide');

	if(quantity) {
		dataPost.quantity = quantity;
	}

	jQuery.ajax({
		url: url,
		type: "post",
		dataType: 'json',
		data: dataPost,
		success: function(result) {
			if(result.success) {
				PagSeguroLightbox(result.data[0]);
			}
			else {
				jQuery(message_error).html(result.message);
				jQuery(message_error).attr('class', 'alert alert-danger');
			}
		},
		complete: function() {
			jQuery(loading_gif).attr('class', 'hide');
			jQuery(button_id).prop('disabled', false);
		}
	});
}