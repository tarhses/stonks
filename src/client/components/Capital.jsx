import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

export default function Capital({ capital, offer, onSelected }) {
    const [selection, setSelection] = useState(capital.map(() => false));

    useEffect(() => {
        setSelection(capital.map(() => false));
    }, [capital]);

    const selected = capital.filter((value, id) => selection[id]);

    return (
        <div>
            <p>
                {capital.map((value, id) =>
                    <span key={id}>
                        {offer && <input
                            type="checkbox"
                            checked={selection[id]}
                            onChange={() => setSelection(selection.map((b, i) => i === id ? !b : b))}
                        />}
                        {value}${id !== capital.length - 1 && ", "}
                    </span>
                )}
            </p>

            {offer
                ? <p><b>Selected:</b> {selected.reduce((acc, value) => acc + value, 0)}$ ({selected.length}/{capital.length}).</p>
                : <p><b>Total:</b> {capital.reduce((sum, value) => sum + value, 0)}$.</p>
            }

            {offer && <button onClick={() => onSelected(selected)}>Make offer</button>}
        </div>
    );
}
