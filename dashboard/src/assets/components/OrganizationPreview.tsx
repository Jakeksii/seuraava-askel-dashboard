type Props = {
    name?: string

}

export default function OrganizationPreview(props: Props) {
    return ( 
        <div>
            <h2>{props.name}</h2>
            <p>Tällä hetkellä ei display koko infoja, koska ei jaksa</p>
        </div>
     );
}