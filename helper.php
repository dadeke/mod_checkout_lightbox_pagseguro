<?php
/**
 * @package Checkout Lightbox with PagSeguro
 * @author Deividson Damasio
 * @copyright 2017 Deividson (deividson.net)
 * @license GNU/GPLv3 http://www.gnu.org/licenses/gpl-3.0.html
 */

defined('_JEXEC') or die;

class ModCheckoutLightboxPagseguroHelper
{

	private static $url_pagseguro = '';

	/**
	 * Retorna o código identificador do pagamento criado no PagSeguro
	 *
	 * @return string
	 */
	public static function getTokenCheckoutAjax()
	{
		$session = JFactory::getSession();
		$jinput = JFactory::getApplication()->input;
		$module_id = $jinput->get('id', 0, 'INT');
		$quantity = $jinput->get('quantity', null);

		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->select($db->quoteName('params'));
		$query->from($db->quoteName('#__modules'));
		$query->where($db->quoteName('id') . ' = '. strval($module_id));
		$db->setQuery($query);
		$result = json_decode($db->loadResult());

		if($result->sandbox_mode == '1') {
			self::$url_pagseguro = 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout';
		}
		else if($result->sandbox_mode == '0') {
			self::$url_pagseguro = 'https://ws.pagseguro.uol.com.br/v2/checkout';
		}

		if(!is_numeric($quantity)) {
			$quantity = $result->quantity;
		}

		$content = "email=" . $result->email													/* E-mail da conta que chama a API. */
			. "&token=" . $result->token														/* Token da conta que chama a API. */
			. "&currency=BRL"																	/* Moeda utilizada. */
			. "&itemId1=" . $result->product_code												/* Identificador do item. */
			. "&itemDescription1=" . $result->product_name										/* Nome descritivo do item. */
			. "&itemAmount1=" . str_replace(array('.', ','), array('', '.'), $result->amount)	/* Valor unitário do item. */
			. "&itemQuantity1=" . $quantity														/* Quantidade do item. */
			. "&reference=" . md5(strval(time()) . $session->getId());						/* Código de referência. */

		if(is_numeric($result->weight)) {
			$content .= "&itemWeight1=" . $result->weight;										/* Peso do item. */
		}

		$ch = curl_init(self::$url_pagseguro);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/x-www-form-urlencoded; charset=utf-8"));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$xml = curl_exec($ch);
		$error = curl_error($ch);
		curl_close($ch);

		if(!empty($error)) {
			throw new Exception(JText::_('MOD_LIGHTBOXPAGSEGURO_ERROR_CHECKOUT').$error);
		}

		$object_return = simplexml_load_string($xml);

		if(empty($object_return->code)) {
			throw new Exception(JText::_('MOD_LIGHTBOXPAGSEGURO_ERROR_CHECKOUT').JText::_('MOD_LIGHTBOXPAGSEGURO_CODE_NULL'));
		}

		return $object_return->code;
	}
}
