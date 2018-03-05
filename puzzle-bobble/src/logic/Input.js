import React, {Component} from 'react';

export class Input extends Component {

  componentDidMount()
    {

      document.addEventListener( 'keydown', function( event ) {
        console.log( 'Pressed: ', event.keyCode );

        if ( event.key === 'ArrowLeft' )
          {
            document.dispatchEvent( new Event( 'moveleft' )
            )
            ;
          }

        if ( event.key === 'ArrowRight' )
          {
            document.dispatchEvent( new Event( 'moveright' )

            )
            ;
          }

        if ( event.keyCode === 32 )
          {
            document.dispatchEvent( new Event( 'shoot' ) );
          }

        if ( event.keyCode === 67 )
          {
            document.dispatchEvent( new Event( 'camera_change' ) );
          }
      } );
    }

  render()
    {
      return null;
    }

}