      /****************************************/
      /*       IDENTIFICATION FUNCTIONS       */
      /****************************************/
      function isTSSmart()
      {
        var isTSSMART     = (navigator.userAgent.indexOf('Linux') >= 0 && navigator.userAgent.indexOf('MOB30J')    >= 0 && screen.width === 1280);
        var isTSSMART7    = (navigator.userAgent.indexOf('Linux') >= 0 && navigator.userAgent.indexOf('MOB30J')    >= 0 && screen.width === 1024);
        var isTSSMART18   = (navigator.userAgent.indexOf('Linux') >= 0 && navigator.userAgent.indexOf('RQ3A')      >= 0 && screen.width === 1280);
        return isTSSMART || isTSSMART7 || isTSSMART18;
      }

      function isIOS()
      {
        var isIpad        = (navigator.userAgent.indexOf('iPad')   >= 0 || navigator.userAgent.indexOf('Macintosh') >= 0);
        var isIphone      = navigator.userAgent.indexOf('iPhone')  >= 0;
        return isIpad || isIphone;
      }

      function isAndroid()
      {
        return navigator.userAgent.indexOf('Android') >= 0 && ( !isTSSmart() ) ;
      }
      
      function isAPPWebView()
      {
        var isAPPWebView  = false; 
        if ((isIOS() && navigator.userAgent.indexOf('Safari') === -1) || (isAndroid() && navigator.userAgent.indexOf('wv') >= 0)) {
          isAPPWebView     = true;
        }
        return isAPPWebView;
      }


      /****************************************/
      /*           COMMAND FUNCTIONS          */
      /****************************************/
      function closeWebview()
      {
        if (isAPPWebView() && BridgeToJavaScript != null) {
          if (isIOS()) { 
            BridgeToJavaScript({ action: 'closeWebview' });
          } else {
            BridgeToJavaScript.closeWebView();
          }
        } 
        else if (isTSSmart() && typeof BridgeToJavaScript !== 'undefined') {
          BridgeToJavaScript.closeWebView('SECURITY');
        }
      }

      function hideWebViewBar()
      {
        if (isAPPWebView() && BridgeToJavaScript != null) {
          if (isIOS()) { 
            BridgeToJavaScript({ action: 'hideBar' });
          } else {
            BridgeToJavaScript.hideBar();
          }
        } 
        else if (isTSSmart() && typeof BridgeToJavaScript !== 'undefined') {
          setTimeout('BridgeToJavaScript.hideBar("SECURITY")', 3000);
        }
      }