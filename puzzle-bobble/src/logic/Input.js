import React, {Component} from 'react';

export class Input extends Component {

  events: {
    'ArrowLeft': 'moveleft',
    'ArrowUp': 'moveright'
  };

  componentDidMount()
    {

      ;

      document.addEventListener( 'keydown', function( event ) {
        console.log( 'Pressed: ', event.keyCode );

        if ( event.key === 'ArrowLeft' )
          {
            document.dispatchEvent( new Event( 'moveleft' )
                ,
                false,
            )
            ;
          }

        if ( event.key === 'ArrowRight' )
          {
            document.dispatchEvent( new Event( 'moveright' )
                ,
                false,
            )
            ;
          }

        if ( event.keyCode === 32 )
          {
            document.dispatchEvent( new Event( 'shoot' ), false );
          }

        if ( event.keyCode === 67 )
          {
            document.dispatchEvent( new Event( 'camera_change' ), false );
          }
      } );
    }

  render()
    {
      return null;
    }

}