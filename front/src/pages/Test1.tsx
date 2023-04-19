import './test1.css'
import { Parallax, Background } from 'react-parallax';
import photo from '../assets/images/old-couple3.png'
import photo2 from '../assets/images/autum.jpeg'
import photo3 from '../assets/images/forest.jpg'
import { Navbar } from 'react-bootstrap';
import Home from './Home';

function Test1() {
  function suma() {
    return 1+2;
  }

    return (
      <div className='main-container'>

        <Navbar className='navbar1'>Navbar</Navbar>
        
        <Parallax
          blur={1}
          bgImage={photo}
          bgImageAlt="old-coupe"
          strength={800}
        >
          <div className='title-div'><p className='title'>PNPM</p><br/></div>
          <div className='div-buttons-home'>
            <button className='button-1'>Hola</button>
            <button className='button-2'>Veamos</button>
          </div>
          <div style={{ height: '500px'}} />
        </Parallax>

        <div className='filler-text'>
          <p>{suma()}Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>

        <Parallax
          blur={1}
          bgImage={photo2}
          bgImageAlt="old-coupe"
          strength={800}
        >
          <div className='title-div'><p style={{color: 'white'}} className='title'>Más texto</p><br/></div>
          
          <div style={{ height: '500px'}} />
        </Parallax>

        <div className='filler-text'>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>

        <Parallax
          blur={1}
          bgImage={photo3}
          bgImageAlt="old-coupe"
          strength={800}
        >
          <div className='title-div'><p style={{color: 'white'}} className='title'>Más texto</p><br/></div>
          
          <div style={{ height: '500px'}} />
        </Parallax>

        <div className='filler-text'>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>
        
        
      </div>
     )
   }

export default Test1