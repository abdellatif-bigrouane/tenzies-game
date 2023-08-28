import './style.css'
import { nanoid } from 'nanoid'

export default function Die({ id, value, isHeld, clickDie }) {
    const arr = [];
    for (let i = 0; i < value; i++) {
        arr.push(i);
    }

    return (
        <div
            className={`die-face dot-${value} ${isHeld && 'is-held'}`}
            onClick={() => clickDie(id)}
        >
            <div className='dot-container'>
                {
                    arr.map(() => <div key={nanoid()} className='dot'></div>)
                }
            </div>
        </div>
    )
}