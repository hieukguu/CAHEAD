import { ImageResponse } from 'next/og';
export const alt='CAhead — Good partnerships. Great possibilities.';
export const dynamic = 'force-static';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{background:'#101f2c',color:'#f7f7f2',width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'65px 75px'}}><div style={{display:'flex',fontSize:40,letterSpacing:-2}}><strong>CA</strong>head<span style={{color:'#8ba9ff'}}>.</span></div><div style={{display:'flex',flexDirection:'column',fontSize:76,letterSpacing:-3,lineHeight:1.1}}><span>Good partnerships.</span><span style={{color:'#8ba9ff'}}>Great possibilities.</span></div><div style={{display:'flex',fontSize:20,color:'#aabac5'}}>AFFILIATE & PERFORMANCE MARKETING</div></div>,size);}
