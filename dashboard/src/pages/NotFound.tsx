import { Link } from "react-router-dom";

interface Props {
    message?: string
}

export default function NotFound(props: Props) {
    return (
        <main style={{ height: '100vh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <div>
                <h1 style={{ display: 'inline-block', margin: '0px 20px 0px 0px', padding: '0px 23px 0px 0px', fontSize: '26px', fontWeight: 500, verticalAlign: 'top', lineHeight: '49px', borderRight: '2px solid white' }}>
                    404
                </h1>
                <div style={{ display: 'inline-block' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 400, lineHeight: '49px', margin: '0px' }}>
                        {props.message ?? "Sivua ei löytynyt"}
                    </h2>
                </div>
            </div>
            <br />
            <Link to="/" className="btn-primary">Etusivulle</Link>
        </main>
    )
}
