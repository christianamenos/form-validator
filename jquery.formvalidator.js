/* ****************************************************************************
 * Filename: jquery.formvalidator.js
 * Version: 0.7.0, July 2013
 * Tested jquery versions:
 * - jQuery v1.8.3
 * ****************************************************************************
 *  * DESCRIPTION:
 * ****************************************************************************
 * 
 * Form-validator is a Jquery plugin that aims to validate forms using HTML5 new
 * input attributes, classes and data-atributes.
 * 
 * If form validation takes most of your time and others validators don't allow
 * you to customize or simplify all your work this is your plugin.
 * 
 * My aim creating this plugin is to take back passing and uncountable number of
 * parameters to the plugin and let the goblins make the most of your work even
 * if you know barelly nothing about JavaScript and jQuery.
 * 
 * All validation messages and alerts will be shown on the same way in all the
 * major browsers so that the user interface does not change a lot from a
 * browser to another unlike what happens when using default browser's
 * validations.
 * 
 * ****************************************************************************
 *  * LICENSE:
 * ****************************************************************************
 *  
 * This project is build under the MIT License (MIT)
 *
 * Copyright (C) 2013
 *  * Christian Amenós - christian.amenos@gmail.com - http://christianamenos.es
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * ****************************************************************************
 */


/*
 * TODO LIST:
 * -> ajax (webservice checking)
 * -> nohtml (do not allow <, >, " and ' characters)
 * -> textarea
 * -> select
 * -> date, time and datetime data-previous attribute to check if the value of another field is lower than the current
 */
(function($) {

  var errorMessages = {
    needNumericParam: 'The value must be a number.',
    minValueMustbeLower: 'Min value must be lower than max.'
  };
  //PRIVATE FUNCTIONS

  /*****************************************************************************
   * Description: this function will serve as a mere alias for console.log
   * message. In case there is not such a cappability it will throw an alert.
   * In params:
   *  @obj {object}: variable to be debugged
   * Return: none
   ****************************************************************************/
  function _log(obj) {
    if (window.console) {
      console.log(obj);
    } else {
      alert(obj);
    }
  }
  
  function _isAlphanumeric(v){
    var re = /^([0-9][a-z])*$/i;
    return re.test(v.toString());
  }

  /*****************************************************************************
   * Description: this function checks if the a value is a natural numer.
   * In params:
   *  @v {number}: variable to be checked
   * Return: boolean
   ****************************************************************************/
  function _isNatural(v) {
    var re = /^[1-9]*[0-9]$/;
    return re.test(v.toString());
  }

  /*****************************************************************************
   * Description: this function checks if the a value is an integer.
   * In params:
   *  @v {number}: variable to be checked
   * Return: boolean
   ****************************************************************************/
  function _isInteger(v) {
    var re = /^-?[1-9]*[0-9]$/;
    return re.test(v.toString());
  }

  /*****************************************************************************
   * Description: this function checks if the a value is a real numer.
   * In params:
   *  @v {number}: variable to be checked
   * Return: boolean
   ****************************************************************************/
  function _isDecimal(v, precision) {
    var re = /^-?[1-9]*[0-9](\.[0-9]+)?$/;
    if (o.comaDecimal) {
      re = /^-?[1-9]*[0-9](,[0-9]+)?$/;
    }
    if (typeof precision !== 'undefined' && _isNatural(precision)) {
      re = new RegExp('/^\-?[1-9]*[0-9](\.[0-9]{' + precision + '})?$/');
      if (o.comaDecimal) {
        re = new RegExp('/^\-?[1-9]*[0-9](,[0-9]{' + precision + '})?$/');
      }
    }
    return re.test(v.toString());
  }

  /*****************************************************************************
   * Description: this function checks if the a value is a positive real numer.
   * In params:
   *  @v {number}: variable to be checked
   * Return: boolean
   ****************************************************************************/
  function _isPositiveDecimal(v, precision) {
    var re = /^[1-9]*[0-9](\.[0-9]+)?$/;
    if (typeof precision !== 'undefined' && _isNatural(precision)) {
      re = new RegExp('/^[1-9]*[0-9](\.[0-9]{' + precision + '})?$/');
    }
    return re.test(v.toString());
  }

  /*****************************************************************************
   * Description: this function checks if the a value is number even if it is
   * representen by exponentials. It will return false not a finite number
   * In params:
   *  @v {number}: variable to be checked
   * Return: boolean
   ****************************************************************************/
  function _isScientificNumber(v) {
    return isFinite(v.toString());
  }

  function _isDate(v) {
    //first we check if the format is correct default date format DD/MM/YYY
    var re = /^((3[0-1])|([0-2][0-9]))\/((1[0-2])|(0[0-9]))\/([0-9]{4})$/;
    var dayPos = 0;
    var monthPos = 1;
    var yearPos = 2;
    if (o.formatDate === 'mdy') {//MM/DD/YYYY format
      re = /^((1[0-2])|(0[0-9]))\/((3[0-1])|([0-2][0-9]))\/([0-9]{4})$/;
      dayPos = 1;
      monthPos = 0;
      yearPos = 2;
    } else if (o.formatDate === 'ymd') {//YYYY/MM/DD format
      re = /^([0-9]{4})\/((1[0-2])|(0[0-9]))\/((3[0-1])|([0-2][0-9]))$/;
      dayPos = 2;
      monthPos = 1;
      yearPos = 0;
    }
    if (!re.test(v.toString())) {
      return false;
    }
    //if the format is correct we check is it is a valid date
    var dateComponents = v.split('/');
    var day = parseInt(dateComponents[dayPos]);
    var month = parseInt(dateComponents[monthPos]);
    var year = parseInt(dateComponents[yearPos]);
    var daysInMonth = 31;
    if (month < 1 || month > 12) {
      return false;
    }
    if (month === 2) {
      daysInMonth = (((year % 4 === 0) && ((!(year % 100 === 0)) || (year % 400 === 0))) ? 29 : 28);
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
      daysInMonth = 30;
    }
    if (day < 1 || day > daysInMonth) {
      return false;
    }
    return true;
  }

  function _isTime(v) {
    var re = /^((2[0-3])|([0-1][0-9]))\:([0-5][0-9])\:([0-5][0-9])$/;
    if (!re.test(v.toString())) {
      return false;
    }
  }

  function _isDatetime(v) {
    var datetime = v.split(' ');
    return _isDate(datetime[0]) && _isTime(datetime[1]);
  }

  /*****************************************************************************
   * Description: sets error actions for a form field.
   * In params:
   *  @el {jquery elem}: element to make changes
   * Return: none
   ****************************************************************************/
  function _setError(el) {
    el.parent().addClass('error');
    el.parent().find('.clue').removeClass('hidden');
  }

  /*****************************************************************************
   * Description: unsets error actions for a form field.
   * In params:
   *  @el {jquery elem}: element to make changes
   * Return: none
   ****************************************************************************/
  function _unsetError(el) {
    el.parent().removeClass('error');
    el.parent().find('.clue').addClass('hidden');
  }

  function _isEmail(v) {
    var re = /^([a-z][0-9])+(\._-[a-z][0-9])*([a-z][0-9])+((\._-[a-z][0-9]))*\.[a-z]{2,3}@$/i;
    return re.test(v.toString());
  }

  /*****************************************************************************
   * Description: this function checks if the input is correct looking for the 
   * html5 attributes and data-attributes set on the code.
   * In params:
   *  @el {jquery elem}: element to check correctness
   * Return: boolean
   ****************************************************************************/
  function _inputValidate(el) {
    var type = "text";
    if (typeof el.attr('type') !== 'undefined') {
      type = el.attr('type');
    }

    //common validations
    if (typeof el.attr('required') !== 'undefined' && el.val().length < 1) {
      _setError(el);
      return false;
    }

    var minLength = el.attr('data-minlength');
    if (typeof minLength !== 'undefined') {
      if (_isNatural(minLength)) {
        if (el.val().length < parseInt(minLength)) {
          _setError(el);
          return false;
        }
      } else {//help for programmer in order to locate errors in his/her code
        _log(el.attr('id') + ' - minLength error: ' + errorMessages.needNumericParam);
        return false;
      }
    }

    var maxLength = el.attr('data-maxlength');
    if (typeof maxLength !== 'undefined') {
      if (_isNatural(maxLength)) {
        if (typeof minLength !== 'undefined' && parseInt(minLength) > parseInt(maxLength)) {
          _log(el.attr('id') + ' - maxLength error: ' + errorMessages.minValueMustbeLower);
          return false;
        }
        if (el.val().length > parseInt(maxLength)) {
          _setError(el);
          return false;
        }
      } else {//help for programmer in order to locate errors in his/her code
        _log(el.attr('id') + ' - maxLength error: ' + errorMessages.needNumericParam);
        return false;
      }
    }

    //specific validations by type
    if (type === 'number') {
      var precision = el.attr('data-precision');
      var numberType = el.attr('data-numclass');
      if (typeof numberType !== 'undefined') {
        if ((numberType === 'natural' && !_isNatural(el.val()))
                || (numberType === 'integer' && !_isInteger(el.val()))
                || (numberType === 'decimal' && !_isDecimal(el.val(), precision))
                || (numberType === 'pdecimal' && !_isPositiveDecimal(el.val(), precision))
                || !_isScientificNumber(el.val())) {
          _setError(el);
          return false;
        }
      } else {
        if (!_isScientificNumber(el.val())) {
          _setError(el);
          return false;
        }
      }
      var min = el.attr('min');
      if (min !== 'undefined' && parseFloat(el.val()) < parseFloat(min)) {
        _setError(el);
        return false;
      }
      var max = el.attr('max');
      if (max !== 'undefined' && parseFloat(el.val()) > parseFloat(max)) {
        _setError(el);
        return false;
      }
    } else if (type === 'email') {
      if (!_isEmail(el.val())) {
        _setError(el);
        return false;
      }
    } else if (type === 'date') {
      if (!_isDate(el.val())) {
        _setError(el);
        return false;
      }
    } else if (type === 'datetime') {
      if (!_isDatetime(el.val())) {
        _setError(el);
        return false;
      }
    } else if (type === 'time') {
      if (!_isTime(el.val())) {
        _setError(el);
        return false;
      }
    } else {
      //text validation
      var pattern = el.attr('pattern');
      if(typeof pattern !== 'undefined'){
        var re = new RegExp(pattern);
        if(!re.test(el.val())){
          _setError(el);
          return false;
        }
      }
      var textType = el.attr('data-type');
      if(typeof textType !== 'undefined'){
        if(textType === 'aphanumeric' && !_isAlphanumeric()){
          _setError(el);
          return false;
        }
      }
    }

    _unsetError(el);
    return true;
  }

  /*****************************************************************************
   * Description: this function checks if the select is correct looking for the 
   * html5 attributes and data-attributes set on the code.
   * In params:
   *  @el {jquery elem}: element to check correctness
   * Return: boolean
   ****************************************************************************/
  function _selectValidate(el) {
    _log(el);
    return false;
  }

  /*****************************************************************************
   * Description: this function checks if the textarea is correct looking for the 
   * html5 attributes and data-attributes set on the code.
   * In params:
   *  @el {jquery elem}: element to check correctness
   * Return: boolean
   ****************************************************************************/
  function _textareaValidate(el) {
    _log(el);
    return false;
  }

  /*****************************************************************************
   * Description: this function is in charge to bind the events that may change
   * the value of the input fields.
   * In params:
   *  @el {jquery elem}: element to set bindings
   * Return: none
   ****************************************************************************/
  function _inputBinding(el) {
    el.on('keyup', function(e) {
      _inputValidate($(e.target));
    });
    el.on('focusout', function(e) {
      _inputValidate($(e.target));
    });
  }

  /*****************************************************************************
   * Description: this function is in charge to bind the events that may change
   * the value of the select fields.
   * In params:
   *  @el {jquery elem}: element to set bindings
   * Return: none
   ****************************************************************************/
  function _selectBinding(el) {
    el.on('focusout', function(e) {
      _selectValidate($(e.target));
    });
  }

  /*****************************************************************************
   * Description: this function is in charge to bind the events that may change
   * the value of the select fields.
   * In params:
   *  @el {jquery elem}: element to set bindings
   * Return: none
   ****************************************************************************/
  function _textareaBinding(el) {
    el.on('keyup', function(e) {
      _textareaValidate($(e.target));
    });
    el.on('focusout', function(e) {
      _textareaValidate($(e.target));
    });
  }

  //PLUGIN CONSTRUCTOR
  /*****************************************************************************
   * @html5 {bool}: if html5 is not set to true even if the browser is prepared 
   * to accept html5 validations, those will be ignored and used plugin's in
   * exchange.
   * @focusFirst {bool}: if there are error we set the focus on the first 
   * element.
   * @stopOnError {bool}: if an error is found we stop looking for more errors.
   * @liveValidation {bool}: each time an input changes it's value the field is
   * validated. Otherwise validate will be activated on form's submit.
   * @comaDecimal {bool}: this param allow the user to enter decimals separating
   * the natural part of the number and the decimal part by a coma.
   * @formatDate {string} Possible values {dmy, mdy, ymd}: this param allow to
   * check date formats on a variation of formats depending on the locale of
   * users.
   ****************************************************************************/
  jQuery.fn.formvalidator = function(options) {
    //Default plugin's attributes
    var defaults = {
      html5: false,
      focusFirst: true,
      stopOnError: false,
      liveValidation: false,
      comaDecimal: false,
      formatDate: 'dmy'
    };
    //Option settings. Overwritten if defined by the programmer
    var o = jQuery.extend(defaults, options);
    return this.each(function() {
      //Storage the selected form to avoid writting too much code
      var e = $(this);
      /*
       * If html5 is not active we don't let the browser check on it's own (if 
       * we only need the validations working for old browser that does not 
       * support newest html5 form attributes).
       */
      if (o.html5 === false) {
        e.attr('novalidate', true);
        //if set a live validation behaviour assign a key and change binding to each input, select and textarea
        if (o.liveValidation) {
          e.find('input').each(function(i, v) {
            _inputBinding($(v));
          });
          e.find('select').each(function(i, v) {
            _selectBinding($(v));
          });
          e.find('textarea').each(function(i, v) {
            _textareaBinding($(v));
          });
        }
        e.on('submit', function(event) {
          //We look for the fields present on the current form in order to validate their values
          var correct = true;
          var first = null;
          e.find('input').each(function(i, v) {
            if (!_inputValidate($(v))) {
              correct = false;
              if (first === null)
                first = $(v);
              if (o.stopOnError) {
                return false; //stop iteration; we don't need to loof further errors
              }
            }
          });
          if (!o.stopOnError || correct) {
            e.find('select').each(function(i, v) {
              if (!_selectValidate($(v))) {
                correct = false;
                if (first === null)
                  first = $(v);
                if (o.stopOnError) {
                  return false; //stop iteration; we don't need to loof further errors
                }
              }
            });
          }
          if (!o.stopOnError || correct) {
            e.find('textarea').each(function(i, v) {
              if (!_textareaValidate($(v))) {
                correct = false;
                if (first === null)
                  first = $(v);
                if (o.stopOnError) {
                  return false; //stop iteration; we don't need to loof further errors
                }
              }
            });
          }
          //if focus first error is set we set user's atention over the field that contains the error
          if (o.focusFirst) {
            $('html, body').animate({
              scrollTop: first.offset().top
            }, 'fast', 'swing', function() {
              first.focus();
            });
          }
          return correct;
        });
      }
    });
  };
})(jQuery);
