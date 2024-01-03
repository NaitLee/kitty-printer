import {useLocalStorage} from "../common/hooks.ts";
import {_} from "../common/i18n.tsx";
import {Icons} from "../common/icons.tsx";

export default function ({visible}:{visible:boolean}){
    let [finishFeed, setFinishFeed] = useLocalStorage<number>('finishFeed', 100);
    let [speed, setSpeed] = useLocalStorage<number>('speed', 32);
    let [energy, setEnergy] = useLocalStorage<number>('energy', 24000);

    return <div className={`${visible?"print__options-container--visible":""} print__options-container`}>
        <div className="stuff__option">
            <span className="option__title">{_('Finish feed')}</span>
            <button className="option__item" value="0"
                    onClick={()=>setFinishFeed(0)}
                    data-selected={finishFeed === 0}>
                <span className="stuff__label">{_('0')}</span>
            </button>
            <button className="option__item" value="50"
                    onClick={()=>setFinishFeed(50)}
                    data-selected={finishFeed === 50}>
                <span className="stuff__label">{_('50')}</span>
            </button>
            <button className="option__item" value="100"
                    onClick={()=>setFinishFeed(100)}
                    data-selected={finishFeed === 100}>
                <span className="stuff__label">{_('100')}</span>
            </button>
            <input className="option__item" type="number" min={0} max={65535} value={finishFeed} onInput={(e:any)=>setFinishFeed(+e.target.value)}/>
        </div>

        <div className="stuff__option">
            <span className="option__title">{_('Speed')}</span>
            <button className="option__item" value="8"
                    onClick={()=>setSpeed(8)}
                    data-selected={speed === 8}>
                <span className="stuff__label">{_('Fastest')}</span>
            </button>
            <button className="option__item" value="16"
                    onClick={()=>setSpeed(16)}
                    data-selected={speed === 16}>
                <span className="stuff__label">{_('Fast')}</span>
            </button>
            <button className="option__item" value="32"
                    onClick={()=>setSpeed(32)}
                    data-selected={speed === 32}>
                <span className="stuff__label">{_('Good Quality')}</span>
            </button>

            <input className="option__item" type="number" min={4} max={255} value={speed} onInput={(e:any)=>setSpeed(+e.target.value)}/>
        </div>

        <div className="stuff__option">
            <span className="option__title">{_('Energy')}</span>
            <button className="option__item" value={12000}
                    onClick={()=>setEnergy(12000)}
                    data-selected={energy === 12000}>
                <span className="stuff__label">{_('Low')}</span>
            </button>
            <button className="option__item" value={24000}
                    onClick={()=>setEnergy(24000)}
                    data-selected={energy === 24000}>
                <span className="stuff__label">{_('Medium')}</span>
            </button>
            <button className="option__item" value={48000}
                    onClick={()=>setEnergy(48000)}
                    data-selected={energy === 48000}>
                <span className="stuff__label">{_('High')}</span>
            </button>

            <input className="option__item" type="number" min={0} max={0xFFFF} value={energy} onInput={(e:any)=>setEnergy(+e.target.value)}/>
        </div>
    </div>
}