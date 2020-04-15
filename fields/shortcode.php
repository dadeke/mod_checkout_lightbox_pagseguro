<?php
/**
 * @package Checkout Lightbox with PagSeguro
 * @author Deividson Damasio
 * @copyright 2020 Deividson (https://www.linkedin.com/in/dadeke/)
 * @license GNU/GPLv3 http://www.gnu.org/licenses/gpl-3.0.html
 */

defined('JPATH_PLATFORM') or die;

class JFormFieldShortCode extends JFormFieldText
{
    protected $type = 'shortcode';

		protected function getInput() {
        $this->setValue('{loadmodule mod_checkout_lightbox_pagseguro,"'
            . $this->form->getValue('title') . '"}');

        $html_field = parent::getInput();
        $search_attribute = 'type="text"';
		$replace_attribute = 'onclick="this.setSelectionRange(0, this.value.length);" '
							. 'style="width:600px;"';

        $html_field = str_replace($search_attribute, $replace_attribute, $html_field);

        return $html_field;
    }
}
