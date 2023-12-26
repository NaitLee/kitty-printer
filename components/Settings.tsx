import {useLocalStorage} from "../common/hooks.ts";
import {_} from "../common/i18n.tsx";

export default function (){
    let [finishFeed, setFinishFeed] = useLocalStorage<number>('finishFeed', 120);
    let [speed, setSpeed] = useLocalStorage<number>('speed', 32);
    let [energy, setEnergy] = useLocalStorage<number>('energy', 0x5000);

    //TODO: Make hard limits for the values

    return <>
        <p>Settings</p>

        <div className="stuff__option">
            <span className="option__title">{_('Finish feed')}</span>
            <input className="option__item" type="number" value={finishFeed} onInput={(e:any)=>setFinishFeed(e.target.value)}/>

        </div>
        <div className="stuff__option">
            <span className="option__title">{_('Speed')}</span>
            <input className="option__item" type="number" value={speed} onInput={(e:any)=>setSpeed(e.target.value)}/>

        </div>
        <div className="stuff__option">
            <span className="option__title">{_('Energy')}</span>
            <input className="option__item" type="number" value={energy} onInput={(e:any)=>setEnergy(e.target.value)}/>

        </div>
    </>
}