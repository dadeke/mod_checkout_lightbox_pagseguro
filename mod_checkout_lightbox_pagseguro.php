<?php
/**
 * @package Checkout Lightbox with PagSeguro
 * @author Deividson Damasio
 * @copyright 2020 Deividson (https://www.linkedin.com/in/dadeke/)
 * @license GNU/GPLv3 http://www.gnu.org/licenses/gpl-3.0.html
 */
 
defined('_JEXEC') or die;

/*
 * Ambiente de teste: sandbox.pagseguro.uol.com.br
 * Produção: pagseguro.uol.com.br
 */
$url_pagseguro = '';
$sandbox_mode = $params->get('sandbox_mode', '1');

if($sandbox_mode == '1') {
	$url_pagseguro = 'sandbox.pagseguro.uol.com.br';
}
else if($sandbox_mode == '0') {
	$url_pagseguro = 'pagseguro.uol.com.br';
}

JHtml::stylesheet("media/mod_checkout_lightbox_pagseguro/css/styles.css");
JHtml::script("https://stc.".$url_pagseguro."/pagseguro/api/v2/checkout/pagseguro.lightbox.js");
JHtml::script("media/mod_checkout_lightbox_pagseguro/js/functions.js");

$show_product_code = $params->get('show_product_code');
$product_code = $params->get('product_code');
$product_name = $params->get('product_name');
$product_description = $params->get('product_description');
$show_quantity = $params->get('show_quantity');
$allow_quantity_change = $params->get('allow_quantity_change', '1');
$quantity = $params->get('quantity');
$amount = $params->get('amount');

$app = JFactory::getApplication();
$menu_itemid = $app->getMenu()->getActive()->id;

require JModuleHelper::getLayoutPath('mod_checkout_lightbox_pagseguro', $params->get('layout', 'default'));
?>