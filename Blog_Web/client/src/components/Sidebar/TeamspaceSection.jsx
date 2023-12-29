import React from 'react';
import { BsPlusLg, BsThreeDots } from 'react-icons/bs';

const TeamspaceSection = ({}) => {
  return (
    <>
      <div className="option-list__header">
        <div className="list-header__title">Teamspaces</div>
        <div className="flex items-center gap-[4px]">
          <BsThreeDots className="list-header__icon" />
          <BsPlusLg className="list-header__icon" />
        </div>
      </div>
      {/* Contains list of pages / notes */}
      {/* <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            className="option-list__menu"
            {...provided.droppableProps}
            ref={provided.innerRef}
          > */}
      {/* Name of the teamspace? */}
      {/* <div
          className="teamspace-header"
          onClick={() => {
            const arrowElement = document.querySelector(
              `[data-v=${`teamspace-1-header__icon`}]`
            );
            if (arrowElement.classList.contains('rotate-icon__animate')) {
              arrowElement.classList.remove('rotate-icon__animate');
            } else arrowElement.classList.add('rotate-icon__animate');
          }}
        >
          <div className="flex items-center">
            <IoHomeSharp className="teamspace-icon" />
            <div
              className="teamspace-header__title"
              style={{ marginLeft: '6px' }}
            >
              example1
            </div>
            <IoIosArrowForward
              style={{ marginLeft: '4px' }}
              className="arrow-icon"
              data-v={`teamspace-1-header__icon`}
            />
          </div>
          <div className="flex items-center gap-[4px]">
            <BsThreeDots className="list-header__icon" />
            <BsPlusLg className="list-header__icon" />
          </div>
        </div> */}
      {/* List of things in that teamspace */}
      {/* <div className="flex flex-col">
          <div
            className="elements-header"
            onClick={() => {
              const arrowElement = document.querySelector(
                `[data-v=${`teamspace-1-header__icon`}]`
              );
              if (arrowElement.classList.contains('rotate-icon__animate')) {
                arrowElement.classList.remove('rotate-icon__animate');
              } else arrowElement.classList.add('rotate-icon__animate');
            }}
          >
            <div className="flex items-center overflow-hidden">
              <IoIosArrowForward
                className="elements-arrow-icon"
                data-v={`teamspace-item-1-header__icon`}
              />
              <AiFillCompass
                style={{ marginRight: '4px' }}
                className="elements-symbol-icon"
              />
              <div className="teamspace-header__title">
                teamspace-header__titleteamspace-header__titleteamspace-header__title
              </div>
            </div>
            <div className="flex items-center gap-[4px]">
              <BsThreeDots className="list-header__icon" />
              <BsPlusLg className="list-header__icon" />
            </div>
          </div>
        </div> */}
      {/* <>{provided.placeholder}</>
          </div>
        )}
      </Droppable> */}
    </>
  );
};

export default TeamspaceSection;
