export default function PageHeader(props: {title: string, description: string}){
  return(
    <div className="page-header">
      <label className="title">{props.title}</label>
      <label className="description">{props.description}</label>
    </div>
  )
}