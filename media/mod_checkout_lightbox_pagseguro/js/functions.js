/**
 * @package Checkout Lightbox with PagSeguro
 * @author Deividson Damasio
 * @copyright 2020 Deividson (https://www.linkedin.com/in/dadeke/)
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
	var buttonpay = jQuery('#buttonpay' + id);
	var loading_gif = jQuery('#loading_gif' + id);
	var message_div = jQuery('#message_div' + id);
	var quantity = jQuery('#quantity' + id).val();
	var url = 'index.php?option=com_ajax';
	var dataPost = {
		module: "checkout_lightbox_pagseguro",
		format: "json",
		method: "gettokencheckout",
		id: id,
		Itemid: menu_itemid
	};

	buttonpay.prop('disabled', true);
	loading_gif.attr('class', '');
	message_div.html('');
	message_div.attr('class', 'alert alert-danger hide');

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
				MostrarPagSeguroLightbox(id, result.data[0]);
			}
			else {
				message_div.html(result.message);
				message_div.attr('class', 'alert alert-danger');
			}
		},
		complete: function() {
			loading_gif.attr('class', 'hide');
			buttonpay.prop('disabled', false);
		}
	});
}

function MostrarPagSeguroLightbox(id, code) {
	var isOpenLightbox = PagSeguroLightbox(code);

	// Redireciona a página caso o navegador não tenha suporte ao Lightbox.
	if(!isOpenLightbox) {
		location.href = "https://" + jQuery('#url_pagseguro' + id).val() + "/v2/checkout/payment.html?code=" + code;
	}
}