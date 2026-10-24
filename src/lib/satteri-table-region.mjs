// Keep wide Markdown tables scrollable without widening the article itself.
export default {
 name:'article-table-region',
 element:{
  filter:['table'],
  visit(node,ctx){
   const parent=ctx.parent(node);
   if(parent?.type==='element'&&parent.properties?.className?.includes('table-wrap'))return;
   ctx.wrapNode(node,{type:'element',tagName:'div',properties:{className:['table-wrap','article-table-scroll'],role:'region',tabIndex:0,ariaLabel:'文章表格，可横向滚动'},children:[]});
  }
 }
};
