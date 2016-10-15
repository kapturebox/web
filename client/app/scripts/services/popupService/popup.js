'use strict';

angular.module('kaptureApp')
  .service('popup', function( $log ) {

    toastr.options = {
      progressBar: true,
      hideDuration: 300,
      showEasing: 'swing',
      positionClass: 'toast-bottom-right'
    };

    return {
      success: function( msg ) {
        toastr.success( msg );
        $log.info( msg );
      },
      info: function( msg ) {
        toastr.info( msg );
        $log.info( msg );
      },
      error: function( msg ) {
        toastr.error( msg );
        $log.error( msg );
      }
    }
  });
