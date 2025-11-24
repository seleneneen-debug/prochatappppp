import React, { useState } from 'react';
import { db } from '../firebase-config';
                <p>Enter your name to join everyone</p>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(event) => setUsername(event.target.value)}
                        onKeyPress={(event) => {
                            event.key === "Enter" && handleJoin();
                        }}
                    />
                </div>
                <button onClick={handleJoin}>Join Chat</button>
            </div >
        </div >
    );
}

export default JoinScreen;
