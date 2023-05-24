import React from 'react';

const LandingWrapper = ({ children }) => {
  return (
    <React.Fragment>
      <main className="main-page">
        <section className="signup">
          <div className="signup__left"></div>
          <div className="signup__right">
            <div className="signup-content">{children}</div>
          </div>
        </section>
      </main>
    </React.Fragment>
  );
};

export default LandingWrapper;
