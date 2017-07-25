<?php
/**
 * @package Checkout Lightbox with PagSeguro
 * @author Deividson Damasio
 * @copyright 2017 Deividson (deividson.net)
 * @license GNU/GPLv3 http://www.gnu.org/licenses/gpl-3.0.html
 */
 
defined('_JEXEC') or die;

/*
 * Ambiente de teste: stc.sandbox.pagseguro.uol.com.br
 * Produção: stc.pagseguro.uol.com.br
 */
$url_pagseguro = '';
$sandbox_mode = $params->get('sandbox_mode', '1');

if($sandbox_mode == '1') {
	$url_pagseguro = 'stc.sandbox.pagseguro.uol.com.br';
}
else if($sandbox_mode == '0') {
	$url_pagseguro = 'stc.pagseguro.uol.com.br';
}

JHtml::stylesheet("media/mod_checkout_lightbox_pagseguro/css/styles.css");
JHtml::script("https://".$url_pagseguro."/pagseguro/api/v2/checkout/pagseguro.lightbox.js");
JHtml::script("media/mod_checkout_lightbox_pagseguro/js/functions.js");

$show_product_code = $params->get('show_product_code');
$product_code = $params->get('product_code');
$product_name = $params->get('product_name');
$product_description = $params->get('product_description');
$show_quantity = $params->get('show_quantity');
$quantity = $params->get('quantity');
$amount = $params->get('amount');

require JModuleHelper::getLayoutPath('mod_checkout_lightbox_pagseguro', $params->get('layout', 'default'));
?>