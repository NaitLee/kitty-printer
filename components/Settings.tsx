import { DEF_DPI, DEF_ENERGY, DEF_FINISH_FEED, DEF_SPEED, ENERGY_RANGE, IN_TO_CM, SPEED_RANGE } from "../common/constants.ts";
import { useLocalStorage } from "../common/hooks.ts";
import { _ } from "../common/i18n.tsx";
import { round_to } from "../common/utility.ts";

export default function ({ visible }: { visible: boolean }) {
    const [finish_feed, set_finish_feed] = useLocalStorage<number>('finishFeed', DEF_FINISH_FEED);
    const [speed, set_speed] = useLocalStorage<number>('speed', DEF_SPEED);
    const [energy, set_energy] = useLocalStorage<number>('energy', DEF_ENERGY);

    const mkset = (f: (value: number) => void) => (e: Event) => f(+(e.target as HTMLInputElement).value);
    const unit_label = (dots: number) => {
        const inches = dots / DEF_DPI;
        const centimeters = inches * IN_TO_CM;
        return _('0-in-1-cm', [round_to(inches, 2), round_to(centimeters, 2)]);
    };

    return <div className={`${visible ? "print__options-container--visible" : ""} print__options-container`}>
        <div className="stuff__option">
            <span className="option__title">{_('finish-feed')}</span>
            <input className="option__item" type="range" min={0} max={DEF_DPI * 2} data-key={visible ? "" : undefined}
                step={DEF_DPI / IN_TO_CM / 2} value={finish_feed} onInput={mkset(set_finish_feed)} />
            <span>{unit_label(finish_feed)}</span>
        </div>

        <div className="stuff__option">
            <span className="option__title">{_('speed')}</span>
            {Object.entries(SPEED_RANGE).map(([label, speed_]) => <button className="option__item" value={speed_}
                    onClick={() => set_speed(speed_)} data-key={visible ? "" : undefined}
                    data-selected={speed === speed_}>
                <span className="stuff__label">{_(label)}</span>
            </button>)}
            <input className="option__item" type="number" min={4} max={0xff} value={speed} onInput={mkset(set_speed)} data-key={visible ? "" : undefined} />
        </div>

        <div className="stuff__option">
            <span className="option__title">{_('strength')}</span>
            {Object.entries(ENERGY_RANGE).map(([label, energy_]) => <button className="option__item" value={energy_}
                    onClick={()=>set_energy(energy_)} data-key={visible ? "" : undefined}
                    data-selected={energy === energy_}>
                <span className="stuff__label">{_(label)}</span>
            </button>)}

            <input className="option__item" type="number" min={0} max={0xFFFF} value={energy} onInput={mkset(set_energy)} data-key={visible ? "" : undefined} />
        </div>
    </div>;
}
