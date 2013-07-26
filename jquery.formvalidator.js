/* ****************************************************************************
 * Filename: jquery.formvalidator.js
 * Version: 0.1.0, July 2013
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
(function($) {
  
  var errorMessages = {
    needNumericParam : 'The value must be a number.',
    minValueMustbeLower : 'Min value must be lower than max.'
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
  
  function _isPositiveNumber(v){
    var re = /^\d+$/;
    return re.test(v);
  }

  function _inputValidate(el) {
    var minLength = el.attr('data-minlength');
    if(typeof minLength !== 'undefined'){
      if(_isPositiveNumber(minLength)){
        if(el.val().length < minLength){
          //TODO: add error class and show clue error
          _log('TODO: value\'s length is lower than specified');
          return false;
        }
      }else{//help for programmer in order to locate errors in his/her code
        _log(el.attr('id')+' - minLength error: '+errorMessages.needNumericParam);
        return false;
      }
    }
    var maxLength = el.attr('data-maxlength');
    if(typeof maxLength !== 'undefined'){
      if(_isPositiveNumber(maxLength)){
        if(typeof minLength !== 'undefined' && minLength > maxLength){
          _log(el.attr('id')+' - maxLength error: '+errorMessages.minValueMustbeLower);
          return false;
        }
        if(el.val().length > maxLength){
          //TODO: add error class and show clue error
          _log('TODO: value\'s length is greater than specified');
          return false;
        }
      }else{
        _log(el.attr('id')+' - maxLength error: '+errorMessages.needNumericParam);
        return false;
      }
    }
    return true;
  }

  function _selectValidate(el) {
    _log(el);
    return false;
  }

  function _textareaValidate(el) {
    _log(el);
    return false;
  }

  function _inputBinding(el) {
    el.on('keyup', function(e) {
      _inputValidate($(e.target));
    });
    el.on('change', function(e) {
      _inputValidate($(e.target));
    });
  }

  function _selectBinding(el) {
    el.on('change', function(e) {
      _selectValidate($(e.target));
    });
  }

  function _textareaBinding(el) {
    el.on('keyup', function(e) {
      _textareaValidate($(e.target));
    });
    el.on('change', function(e) {
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
   ****************************************************************************/
  jQuery.fn.formvalidator = function(options) {
    //Default plugin's attributes
    var defaults = {
      html5: false,
      focusFirst: true,
      stopOnError: false,
      liveValidation: false
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
          e.find('input').each(function(i, v) {
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
                return false;//stop iteration; we don't need to loof further errors
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
                  return false;//stop iteration; we don't need to loof further errors
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
                  return false;//stop iteration; we don't need to loof further errors
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
