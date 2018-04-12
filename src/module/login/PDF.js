import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Button } from 'antd'
import jsPDF from 'jspdf';

import './style/pdf.less'

class PDF extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }
  componentDidMount () {
    this.pdf()
  }

  pdf = () => {
    var doc = new jsPDF('p', 'px','a4'); 
    //var doc = new jsPDF('landscape');//横排 
    
    doc.setProperties({//设置文档属性 
      title: 'Title', 
      subject: 'This is the subject', 
      author: 'Dragon', 
      keywords: 'javascript, web 2.0, ajax', 
      creator: 'MEEE' 
    }); 
    
    doc.setTextColor(0,255,0); 
    doc.setFontSize(22); 
    doc.setFont("times"); 
    doc.setFontType("italic"); 
    doc.text(30, 35, 'Hello world!');//添加文字 
    
    doc.setTextColor(255,0,0); 
    doc.setFontSize(16); 
    doc.setFont("helvetica"); 
    doc.setFontType("bold"); 
    doc.text(30, 45, 'This is client-side Javascript, pumping out a PDF.'); 
    
    doc.addPage();//添加页 
    
    doc.setLineWidth(1);//设置线宽 
    doc.setDrawColor(0,255,0);//设置画笔颜色 
    doc.setFillColor(255,0,0);//设置填充颜色 
    doc.line(60, 20, 115, 60);//画线，两个坐标 
    doc.rect(100, 50, 20, 30); //画矩形，左上角坐标，宽度，高度，只有边框 
    doc.ellipse(20, 20, 20, 10, 'F');//画椭圆，中心点坐标，宽度，高度，只有边 
    doc.circle(120, 20, 20, 'FD');//画圆，中心点坐标，半径，边框和填充都有 
    doc.triangle(100, 100, 110, 100, 120, 130, 'FD'); 
    
    //doc.output('datauri');//直接输出为新的web页 
    document.getElementById("iframe123").src = doc.output('datauristring');//在iframe中显示 
    // document.getElementById("iframe123").src = doc.save('test.pdf');//在iframe中显示 

  }

  render() {
    return (
      <div className="pdf">
        <div className="go-back">
          <Button  type="primary" onClick={()=>{this.props.history.goBack()}}>返回</Button>
        </div>
        <iframe 
          id="iframe123"
          frameBorder="0"
          width="100%"
          height="800"
          scrolling='no'
        />
      </div>
    ); 
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps,mapDispatchToProps)(PDF);
