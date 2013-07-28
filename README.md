About Form-validator:
=====================

Form-validator it's a Jquery plugin that aims to validate forms using HTML5 new input attributes, classes and data-atributes.

If form validation takes most of your time and others validators don't allow you to customize or simplify all your work this is your plugin.

My aim creating this plugin is to take back passing and uncountable number of parameters to the plugin and let the goblins make the most of your work even if you know barelly nothing about JavaScript and jQuery.

All validation messages and alerts will be shown on the same way in all the major browsers so that the user interface does not change a lot from a browser to another unlike what happens when using default browser's validations.


How to use it:
==============

Using form-validator is easy. We just have to include jquery and jquery.formvalidator to our page and add the validation to the forms we want to validate once the page is loaded like so:

  $('#formId').formvalidator();

This way the form-validator will take it's default values and will validate the form elements when we try to submit.

As many other plugins you can configure the plugin with some options. For doing so you just have to pass an object data as a paràmeter. Below will be listed the current supported configurations:

* html5 gem `{bool}`: if html5 is not set to true even if the browser is prepared to accept html5 validations, those will be ignored and used plugin's in exchange.
* focusFirst `{bool}`: if there are error we set the focus on the first element.
* stopOnError `{bool}`: if an error is found we stop looking for more errors.
* liveValidation `{bool}`: each time an input changes it's value the field is validated. Otherwise validate will be activated on form's submit.
* comaDecimal `{bool}`: this param allow the user to enter decimals separating the natural part of the number and the decimal part by a coma.
* formatDate `{string [dmy, mdy, ymd]}`: this param allow to check date formats on a variation of formats depending on the locale of users.

This way we could configure our plugin to validate every field of the selected form like so:

  $('#formId').formvalidator({liveValidation: true});

Fields configurations:
======================

As explained at the top in order to configure our fields to be validated we have to use HTML5 form elements and attributes and custom data-attributes.

Input fields validations:
-------------------------

### Text

### Date

### Time

### Datetime

### Email

Select fields validations:
--------------------------

Nothing yet

Textarea fields validations:
----------------------------

Nothing yet